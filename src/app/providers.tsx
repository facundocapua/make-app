'use client'

import { SessionProvider } from 'next-auth/react'
import UserContextProvider from '@/context/user'
import type { ReactNode } from 'react'

export default function Providers ({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <UserContextProvider>
        {children}
      </UserContextProvider>
    </SessionProvider>
  )
}
