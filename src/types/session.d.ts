import type { Session } from 'next-auth'

export type UserSession = Session & {
  accessToken: string
  error?: string
}
