import { useState, useEffect, useContext } from 'react'
import { GetEventsProps, listEvents } from '@/services/google'
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

type Props = {
  onlyFutureEvents?: boolean
}

export default function useEventCollection ({ onlyFutureEvents }: Props = { onlyFutureEvents: false }): EventCollectionResponse {
  const [events, setEvents] = useState <Array<EventType>>()
  const [loading, setLoading] = useState <boolean>(true)
  const session = useSession().data as UserSession
  const { calendar } = useContext(UserContext)

  useEffect(() => {
    const calendarId = calendar?.id ?? ''
    const accessToken = session?.accessToken ?? ''
    if (calendarId !== '' && accessToken !== '') {
      const params: GetEventsProps = { calendarId, accessToken: String(accessToken) }
      if (onlyFutureEvents) {
        const today = new Date()
        params.since = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      }

      setLoading(true)
      listEvents(params).then((events: Array<EventType>) => {
        setEvents(events)
        setLoading(false)
      })
    }
  }, [session?.accessToken, calendar?.id, onlyFutureEvents])

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
