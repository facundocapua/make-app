import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { refreshAccessToken, scopes } from '@/services/google/auth'
import { SessionCallbackProps } from '@/services/google/types'

export const authOptions:NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: scopes.join(' ')
        }
      }
    })
  ],
  callbacks: {
    async jwt ({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: (account.expires_at ?? 0) * 1000,
          refreshToken: account.refresh_token,
          user
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < Number(token.accessTokenExpires)) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    async session ({ session, token }: SessionCallbackProps) {
      session.user = token.user
      session.accessToken = token.accessToken
      session.error = token.error

      return session
    }
  }
}
export default NextAuth(authOptions)
