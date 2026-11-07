import { describe, expect, it, vi } from 'vitest'
import { GoogleApiError, listEvents, makeApiCall } from '@/services/google'
import { createEvent, deleteEvent, getEvent, updateEvent } from './events'
import { appendRow } from './sheets'
import { parseGoogleEvent } from './parse-event'

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status })

const mockFetch = (handler: (url: string) => Response) => {
  const fetchMock = vi.fn<typeof fetch>(async (url) => handler(String(url)))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const stored = (n: number) => ({
  id: `e${n}`,
  summary: 'x',
  description: JSON.stringify({ fullName: `c${n}`, date: '2026-05-01T12:00:00.000Z', duration: 60, price: 10, deposit: 5, id: 'old' })
})

describe('listEvents', () => {
  it('follows every page', async () => {
    const pages = [
      { items: [stored(1), stored(2)], nextPageToken: 'tok2' },
      { items: [stored(3)], nextPageToken: 'tok3' },
      { items: [stored(4)] }
    ]
    const fetchMock = mockFetch(() => json(pages.shift()))

    const events = await listEvents({ calendarId: 'c', accessToken: 't' })

    expect(events.map(({ id }) => id)).toEqual(['e1', 'e2', 'e3', 'e4'])
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(fetchMock.mock.calls[1][0]).toContain('pageToken=tok2')
    expect(fetchMock.mock.calls[2][0]).toContain('pageToken=tok3')
  })

  it('handles a calendar without items', async () => {
    mockFetch(() => json({}))
    await expect(listEvents({ calendarId: 'c', accessToken: 't' })).resolves.toEqual([])
  })
})

describe('parseGoogleEvent', () => {
  it('uses the Google ID over the stored one', () => {
    expect(parseGoogleEvent(stored(1)).id).toBe('e1')
  })

  it.each([
    ['free text', 'texto libre'],
    ['JSON that is not an event', '123'],
    ['no description', undefined]
  ])('builds the event from Calendar fields with %s', (_name, description) => {
    const event = parseGoogleEvent({
      id: 'manual',
      summary: 'Reunion',
      description,
      start: { dateTime: '2026-05-01T12:00:00Z' },
      end: { dateTime: '2026-05-01T13:30:00Z' }
    } as Parameters<typeof parseGoogleEvent>[0])

    expect(event).toMatchObject({ id: 'manual', fullName: 'Reunion', date: '2026-05-01T12:00:00Z', duration: 90, price: 0, deposit: 0 })
  })

  it('places an all-day event on its own day in Argentina', () => {
    const event = parseGoogleEvent({
      id: 'holiday',
      summary: 'Feriado',
      start: { date: '2026-05-03' },
      end: { date: '2026-05-04' }
    } as Parameters<typeof parseGoogleEvent>[0])

    expect(event.date).toBe('2026-05-03T03:00:00.000Z')
    expect(event.duration).toBe(120)
  })
})

describe('error handling', () => {
  it.each([
    ['listEvents', () => listEvents({ calendarId: 'c', accessToken: 't' })],
    ['getEvent', () => getEvent({ calendarId: 'c', eventId: 'e', accessToken: 't' })],
    ['createEvent', () => createEvent({ calendarId: 'c', event: {}, accessToken: 't' })],
    ['updateEvent', () => updateEvent({ calendarId: 'c', event: { id: 'e' }, accessToken: 't' })],
    ['deleteEvent', () => deleteEvent({ calendarId: 'c', eventId: 'e', accessToken: 't' })],
    ['appendRow', () => appendRow({ spreadsheetId: 's', range: 'r', data: {}, accessToken: 't' })]
  ] as Array<[string, () => Promise<unknown>]>)('%s throws a GoogleApiError', async (_name, call) => {
    mockFetch(() => json({ error: { message: 'Forbidden' } }, 403))
    const error = await call().catch(e => e)

    expect(error).toBeInstanceOf(GoogleApiError)
    expect(error).toMatchObject({ status: 403, message: 'Forbidden' })
  })

  it('handles an error without a JSON body', async () => {
    mockFetch(() => new Response('<html>', { status: 502, statusText: 'Bad Gateway' }))
    await expect(makeApiCall({ url: '/x', accessToken: 't' })).rejects.toMatchObject({ status: 502 })
  })

  it('accepts an empty response on delete', async () => {
    mockFetch(() => new Response(null, { status: 204 }))
    await expect(deleteEvent({ calendarId: 'c', eventId: 'e', accessToken: 't' })).resolves.toBeNull()
  })
})

describe('URLs', () => {
  it('encodes IDs so they cannot change the path', async () => {
    const fetchMock = mockFetch(() => new Response(null, { status: 204 }))
    await deleteEvent({ calendarId: 'a@group.calendar.google.com', eventId: '../../x?y', accessToken: 't' })

    expect(fetchMock.mock.calls[0][0]).toContain('/calendars/a%40group.calendar.google.com/events/..%2F..%2Fx%3Fy')
  })
})
