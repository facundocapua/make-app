import { useState, useEffect, useContext } from 'react'
import { listEvents } from '@/services/google'
import { UserContext } from '@/context/user'
import { useSession } from 'next-auth/react'
import type { EventType } from '@/types/event'
import { updateEvent as updateEventService } from '@/services/api/updateEvent'
import { deleteEvent as deleteEventService } from '@/services/api/deleteEvent'
import { UserSession } from '@/types/session'

type EventCollectionResponse = {
  data: Array<EventType> | undefined,
  loading: boolean,
  updateEvent: (event: EventType) => void,
  deleteEvent: (id: EventType['id']) => void
}

export default function useEventCollection (): EventCollectionResponse {
  const [events, setEvents] = useState <Array<EventType>>()
  const [loading, setLoading] = useState <boolean>(true)
  const session = useSession().data as UserSession
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

  const deleteEvent = (id: EventType['id']) => {
    deleteEventService({ id })
    const newEvents = events?.filter((e) => e.id !== id)
    setEvents(newEvents)
  }

  return { data: events, loading, updateEvent, deleteEvent }
}
