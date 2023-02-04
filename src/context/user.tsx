import React, { useEffect } from 'react'
import type { CalendarType } from '@/services/google'
import { getCalendar } from '@/services/google'
import { useSession, signOut } from 'next-auth/react'
import { UserSession } from '@/types/session'

export type UserContextType = {
  calendar?: CalendarType | null
}

export const UserContext = React.createContext<UserContextType>({})

export type UserProviderProps = {
  accessToken: string,
  calendarName: string,
  children: React.ReactNode,
}

const UserProvider: React.FC<UserProviderProps> = ({ calendarName, children }) => {
  const [calendar, setCalendar] = React.useState<CalendarType | null>(null)
  const sess = useSession()
  const session = sess.data as UserSession

  useEffect(() => {
    const accessToken = session?.accessToken as string
    if (accessToken) {
      getCalendar({ accessToken, name: calendarName }).then(setCalendar)
    }
  }, [session?.accessToken, calendarName])

  useEffect(() => {
    const error = session?.error as string
    if (error === 'RefreshAccessTokenError') {
      signOut()
    }
  }, [session?.error])

  return (<UserContext.Provider value={{ calendar }}>{children}</UserContext.Provider>)
}

export default UserProvider
