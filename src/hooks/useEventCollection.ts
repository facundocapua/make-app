import { useState, useEffect, useContext } from 'react'
import { listEvents } from '@/services/google'
import { UserContext } from '@/context/user'
import { useSession } from 'next-auth/react'
import type { EventType } from '@/types/event'
import { updateEvent as updateEventService } from '@/services/api/updateEvent'

type EventCollectionResponse = {
  data: Array<EventType> | undefined,
  loading: boolean,
  updateEvent: (event: EventType) => void,
}

export default function useEventCollection (): EventCollectionResponse {
  const [events, setEvents] = useState <Array<EventType>>()
  const [loading, setLoading] = useState <boolean>(true)
  const { data: session } = useSession()
  const { calendar } = useContext(UserContext)

  useEffect(() => {
    const calendarId = calendar?.id ?? ''
    const accessToken = session?.accessToken ?? ''
    if (calendarId !== '' && accessToken !== '') {
      setLoading(true)
      listEvents({ calendarId, accessToken: String(accessToken) }).then((events: Array<EventType>) => {
        setEvents(events)
        setLoading(false)
      })
    }
  }, [session?.accessToken, calendar?.id])

  const updateEvent = (event: EventType) => {
    updateEventService(event)

    const newEvents = events?.map((e) => {
      if (e.id === event.id) {
        return event
      }
      return e
    })
    setEvents(newEvents)
  }

  return { data: events, loading, updateEvent }
}
