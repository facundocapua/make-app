import { describe, expect, it, vi } from 'vitest'
import { refreshAccessToken } from './auth'

type Token = Parameters<typeof refreshAccessToken>[0]

const mockFetch = (status: number, body: unknown) => {
  const fetchMock = vi.fn<typeof fetch>(async () => new Response(JSON.stringify(body), { status }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('refreshAccessToken', () => {
  it('stores the new token, its expiry and clears the previous error', async () => {
    const fetchMock = mockFetch(200, { access_token: 'new', expires_in: 3600 })
    const now = Date.now()

    const token = await refreshAccessToken({ refreshToken: 'rt', accessToken: 'old', error: 'RefreshAccessTokenError' } as Token)

    expect(token).toMatchObject({ accessToken: 'new', refreshToken: 'rt' })
    expect(token.error).toBeUndefined()
    expect(Math.abs(Number(token.accessTokenExpires) - now - 3600000)).toBeLessThan(5000)

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).not.toContain('client_secret')
    expect(String(init?.body)).toContain('grant_type=refresh_token')
  })

  it('does not call Google without a refresh token', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const fetchMock = mockFetch(200, {})

    const token = await refreshAccessToken({ accessToken: 'old' } as Token)

    expect(token.error).toBe('RefreshAccessTokenError')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('reports a rejected refresh', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    mockFetch(400, { error: 'invalid_grant' })

    const token = await refreshAccessToken({ refreshToken: 'rt' } as Token)

    expect(token.error).toBe('RefreshAccessTokenError')
  })
})
