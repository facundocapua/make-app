import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { EventType } from '@/types/event'
import { getEvent, updateEvent } from '@/services/google/events'
import { setNotification } from '@/components/toaster/toaster'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { updateEventAction, updateEventPictureAction } from './actions'

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }))

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: class {
    send = sendMock
  },
  DeleteObjectCommand: class {
    input: unknown
    constructor (input: unknown) {
      this.input = input
    }
  },
  PutObjectCommand: class {}
}))
vi.mock('@aws-sdk/s3-request-presigner', () => ({ getSignedUrl: vi.fn() }))

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }))
vi.mock('next/navigation', () => ({ redirect: vi.fn() }))
vi.mock('@/utils/auth-options', () => ({ authOptions: {} }))
vi.mock('@/components/toaster/toaster', () => ({ setNotification: vi.fn() }))
vi.mock('@/services/google', () => ({
  CALENDAR_NAME: 'MakeApp Calendar',
  CALENDAR_DEFAULT_TIMEZONE: 'America/Argentina/Buenos_Aires',
  getCalendar: vi.fn(async () => ({ id: 'calendar' }))
}))
vi.mock('@/services/google/events', () => ({
  getEvent: vi.fn(),
  updateEvent: vi.fn(),
  deleteEvent: vi.fn()
}))

const stored: EventType = {
  id: 'e1',
  fullName: 'Ana',
  date: '2026-05-01T13:00:00.000Z',
  price: 100,
  deposit: 50,
  duration: 60,
  includesTest: false,
  picture: 'https://pictures.example/original.png'
}

const getSavedRecord = () => {
  const { event } = vi.mocked(updateEvent).mock.calls[0][0]
  return JSON.parse(event.description)
}

describe('updateEventAction', () => {
  beforeEach(() => {
    vi.mocked(getServerSession).mockResolvedValue({ accessToken: 'token' })
    vi.mocked(getEvent).mockResolvedValue(stored)
    vi.mocked(updateEvent).mockReset()
    vi.mocked(setNotification).mockReset()
    vi.mocked(redirect).mockReset()
  })

  it('rejects a request without a session', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)

    await expect(updateEventAction('e1', { fullName: 'Eva' })).rejects.toThrow('Unauthorized')
    expect(updateEvent).not.toHaveBeenCalled()
  })

  it('applies the change over the stored event', async () => {
    await updateEventAction('e1', { fullName: 'Eva' })

    expect(getSavedRecord()).toEqual({ ...stored, fullName: 'Eva' })
    expect(setNotification).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }))
    expect(redirect).toHaveBeenCalledWith('/event/e1')
  })

  it('ignores fields the client cannot edit', async () => {
    const changes = { notes: 'hola', picture: 'https://evil.example/x.png', duration: 30, id: 'other' }

    await updateEventAction('e1', changes)

    const record = getSavedRecord()
    expect(record.picture).toBe(stored.picture)
    expect(record.duration).toBe(stored.duration)
    expect(record.notes).toBe('hola')
    expect(vi.mocked(updateEvent).mock.calls[0][0].event.id).toBe('e1')
  })

  it('does not save a price below the stored deposit', async () => {
    await updateEventAction('e1', { price: 10 })

    expect(updateEvent).not.toHaveBeenCalled()
    expect(setNotification).toHaveBeenCalledWith(expect.objectContaining({ type: 'error', message: 'La seña no puede superar el precio' }))
    expect(redirect).toHaveBeenCalledWith('/event/e1')
  })

  it('reports a Google error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(updateEvent).mockRejectedValue(new Error('boom'))

    await updateEventAction('e1', { fullName: 'Eva' })

    expect(setNotification).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }))
  })
})

describe('updateEventPictureAction', () => {
  const PUBLIC_URL = 'https://pictures.example'
  const PICTURE = `${PUBLIC_URL}/new.jpg`

  beforeEach(() => {
    vi.stubEnv('CLOUDFLARE_R2_PUBLIC_URL', PUBLIC_URL)
    vi.stubEnv('CLOUDFLARE_R2_BUCKET_NAME', 'bucket')
    vi.mocked(getServerSession).mockResolvedValue({ accessToken: 'token' })
    vi.mocked(getEvent).mockResolvedValue(stored)
    vi.mocked(updateEvent).mockReset()
    vi.mocked(setNotification).mockReset()
    vi.mocked(redirect).mockReset()
    sendMock.mockReset()
  })

  it('saves the picture and keeps the file', async () => {
    await updateEventPictureAction('e1', PICTURE)

    expect(getSavedRecord().picture).toBe(PICTURE)
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('deletes the uploaded file when the event cannot be saved', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(updateEvent).mockRejectedValue(new Error('boom'))

    await updateEventPictureAction('e1', PICTURE)

    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock.mock.calls[0][0].input).toEqual({ Bucket: 'bucket', Key: 'new.jpg' })
    expect(setNotification).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }))
    expect(redirect).toHaveBeenCalledWith('/event/e1')
  })

  it('still reports the error when the file cannot be deleted', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(updateEvent).mockRejectedValue(new Error('boom'))
    sendMock.mockRejectedValue(new Error('R2 is down'))

    await updateEventPictureAction('e1', PICTURE)

    expect(setNotification).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }))
    expect(redirect).toHaveBeenCalledWith('/event/e1')
  })

  it('rejects a URL outside the bucket without deleting anything', async () => {
    await expect(updateEventPictureAction('e1', 'https://evil.example/x.png')).rejects.toThrow('Invalid picture URL')
    expect(sendMock).not.toHaveBeenCalled()
  })
})
