import { CalendarType, getCalendar } from '@/services/google'
import { useState, useEffect } from 'react'

type CalendarProps = {
  name: string,
  accessToken: string
}

type CalendarResponse = {
  calendar: CalendarType | undefined,
  loading: boolean
}

export default function useCalendar ({ name = '', accessToken = '' }: CalendarProps): CalendarResponse {
  const [calendar, setCalendar] = useState <CalendarType | undefined>()
  const [loading, setLoading] = useState <boolean>(false)

  useEffect(() => {
    if (loading) return // avoid re-rendering if loading is true
    setLoading(true)
    if (name !== '' && accessToken !== '') {
      setLoading(true)
      getCalendar({ name, accessToken }).then((calendar) => {
        setCalendar(calendar)
        setLoading(false)
      })
    }
  }, [name, accessToken])

  return { calendar, loading }
}
