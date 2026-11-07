import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { EventType } from '@/types/event'
import { getEvent, updateEvent } from '@/services/google/events'
import { setNotification } from '@/components/toaster/toaster'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { updateEventAction } from './actions'

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
