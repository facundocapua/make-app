import { afterEach, describe, expect, it, vi } from 'vitest'
import { getCalendar } from '@/services/google'

const NAME = 'MakeApp Calendar'
const TEN_MINUTES = 10 * 60 * 1000

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status })

const mockFetch = (handler: () => Response = () => json({ items: [{ id: 'calendar', summary: NAME }] })) => {
  const fetchMock = vi.fn<typeof fetch>(async () => handler())
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

// The cache is module state, so each test uses its own token
describe('getCalendar', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('asks Google only once for the same token', async () => {
    const fetchMock = mockFetch()

    const first = await getCalendar({ name: NAME, accessToken: 'repeat' })
    const second = await getCalendar({ name: NAME, accessToken: 'repeat' })

    expect(first.id).toBe('calendar')
    expect(second.id).toBe('calendar')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('does not share the calendar between tokens', async () => {
    const fetchMock = mockFetch()

    await getCalendar({ name: NAME, accessToken: 'user-a' })
    await getCalendar({ name: NAME, accessToken: 'user-b' })

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('asks again once the cache expires', async () => {
    vi.useFakeTimers()
    const fetchMock = mockFetch()

    await getCalendar({ name: NAME, accessToken: 'expiring' })
    vi.advanceTimersByTime(TEN_MINUTES - 1)
    await getCalendar({ name: NAME, accessToken: 'expiring' })
    expect(fetchMock).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(1)
    await getCalendar({ name: NAME, accessToken: 'expiring' })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('does not cache a failure', async () => {
    mockFetch(() => json({ error: { message: 'Unavailable' } }, 503))
    await expect(getCalendar({ name: NAME, accessToken: 'failing' })).rejects.toMatchObject({ status: 503 })

    mockFetch()
    await expect(getCalendar({ name: NAME, accessToken: 'failing' })).resolves.toMatchObject({ id: 'calendar' })
  })

  it('creates the calendar only once for simultaneous requests', async () => {
    const fetchMock = vi.fn<typeof fetch>(async (_url, init) => {
      return json(init?.method === 'POST' ? { id: 'new', summary: NAME } : { items: [] })
    })
    vi.stubGlobal('fetch', fetchMock)

    const calendars = await Promise.all([
      getCalendar({ name: NAME, accessToken: 'new-user' }),
      getCalendar({ name: NAME, accessToken: 'new-user' })
    ])

    expect(calendars.map(({ id }) => id)).toEqual(['new', 'new'])
    expect(fetchMock.mock.calls.filter(([, init]) => init?.method === 'POST')).toHaveLength(1)
  })
})
