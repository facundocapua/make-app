'use client'

import { SessionProvider } from 'next-auth/react'
import AlertProvider from '@/context/alerts'
import UserContextProvider from '@/context/user'
import { CALENDAR_NAME } from '@/services/google'
import type { ReactNode } from 'react'

export default function Providers ({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <UserContextProvider calendarName={CALENDAR_NAME}>
        <AlertProvider>
          {children}
        </AlertProvider>
      </UserContextProvider>
    </SessionProvider>
  )
}
