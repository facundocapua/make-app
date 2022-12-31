import { Account, Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export type TokenType = JWT & {
  accessToken?: string,
  accessTokenExpires?: number,
  refreshToken?: string,
  error?: string,
  user?: User
}

export type SessionType = Session & {
  accessToken?: string,
  error?: string,
}

export type JWTCallbackProps = {
  token: TokenType,
  user?: User | undefined,
  account?: Account | undefined,
}

export type SessionCallbackProps = {
  session: SessionType,
  token: TokenType
}

export type GoogleEventType = {
  id: string,
  status: string,
  htmlLink: string,
  summary: string,
  description: string,
  start: {
    dateTime: string,
    timeZone: string
  },
  end: {
    dateTime: string,
    timeZone: string
  }
}
