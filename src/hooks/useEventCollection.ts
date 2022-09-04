import { useState, useEffect, useContext } from 'react'
import { listEvents, EventItem } from '@/services/google'
import { UserContext } from '@/context/user'
import { useSession } from 'next-auth/react'

export type GroupedEventItemType = {
  date: string,
  events: Array<EventItem>,
}

export type GroupedEventCollection = {
  [key: string]: GroupedEventItemType
}

type EventCollectionResponse = {
  data: Array<GroupedEventItemType> | undefined,
  loading: boolean,
}

const groupByDate = (events: Array<EventItem>): Array<GroupedEventItemType> => {
  const groupedEvents = events.reduce((current: GroupedEventCollection, item) => {
    const startDate = new Date(item.start.dateTime)
    const dateIndex = `${startDate.getFullYear()}_${startDate.getMonth()}_${startDate.getDate()}`
    current[dateIndex] ??= {
      date: startDate.toString(),
      events: []
    }
    current[dateIndex].events.push(item)
    return current
  }, {})
  return Object.values(groupedEvents)
}

export default function useEventCollection (): EventCollectionResponse {
  const [events, setEvents] = useState <Array<GroupedEventItemType>>()
  const [loading, setLoading] = useState <boolean>(true)
  const { data: session } = useSession()
  const { calendar } = useContext(UserContext)

  useEffect(() => {
    const calendarId = calendar?.id ?? ''
    const accessToken = session?.accessToken ?? ''
    if (calendarId !== '' && accessToken !== '') {
      setLoading(true)
      listEvents({ calendarId, accessToken }).then((events: EventItem[]) => {
        const groupedEvents = groupByDate(events)
        setEvents(groupedEvents)
        setLoading(false)
      })
    }
  }, [session?.accessToken, calendar?.id])

  return { data: events, loading }
}
