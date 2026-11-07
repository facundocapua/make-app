'use client'

import { SessionProvider } from 'next-auth/react'
import AlertProvider from '@/context/alerts'
import UserContextProvider from '@/context/user'
import type { ReactNode } from 'react'

export default function Providers ({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <UserContextProvider>
        <AlertProvider>
          {children}
        </AlertProvider>
      </UserContextProvider>
    </SessionProvider>
  )
}
