import { describe, expect, it } from 'vitest'
import type { NextAuthOptions } from 'next-auth'
import { authOptions, browserAuthOptions } from './auth-options'

const getSession = (options: NextAuthOptions) => {
  const token = { accessToken: 'secret', refreshToken: 'refresh', user: { email: 'a@example.com' }, error: 'SomeError' }
  return options.callbacks?.session?.({ session: {}, token } as never)
}

describe('session callbacks', () => {
  it('gives server code the Google token', async () => {
    expect(await getSession(authOptions)).toMatchObject({ accessToken: 'secret' })
  })

  it('never gives the browser a Google token', async () => {
    const session = await getSession(browserAuthOptions)

    expect(session).toEqual({ user: { email: 'a@example.com' }, error: 'SomeError' })
    expect(JSON.stringify(session)).not.toContain('secret')
    expect(JSON.stringify(session)).not.toContain('refresh')
  })

  it('shares everything else between both configurations', () => {
    expect(browserAuthOptions.providers).toBe(authOptions.providers)
    expect(browserAuthOptions.callbacks?.signIn).toBe(authOptions.callbacks?.signIn)
    expect(browserAuthOptions.callbacks?.jwt).toBe(authOptions.callbacks?.jwt)
  })
})
