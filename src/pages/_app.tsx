import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import Main from '@/components/Layout/Main'
import AlertProvider from '@/context/alerts'
import UserContextProvider from '@/context/user'
import { CALENDAR_NAME } from '@/services/google'

function MyApp ({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <UserContextProvider accessToken={session?.accessToken} calendarName={CALENDAR_NAME}>
        <AlertProvider>
          <Main>
            <Component {...pageProps} />
          </Main>
        </AlertProvider>
      </UserContextProvider>
    </SessionProvider>
  )
}

export default MyApp
