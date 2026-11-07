import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import type { UserSession } from '@/types/session'

export default function UserProvider ({ children }: { children: ReactNode }) {
  const session = useSession().data as UserSession

  useEffect(() => {
    const error = session?.error as string
    if (error === 'RefreshAccessTokenError') {
      signOut()
    }
  }, [session?.error])

  return children
}
