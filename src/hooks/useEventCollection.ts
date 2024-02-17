import { useState, useEffect, useContext } from 'react'
import type { GetEventsProps } from '@/services/google'
import { listEvents } from '@/services/google'
import { UserContext } from '@/context/user'
import { useSession } from 'next-auth/react'
import type { EventType } from '@/types/event'
import { updateEvent as updateEventService } from '@/services/api/updateEvent'
import { deleteEvent as deleteEventService } from '@/services/api/deleteEvent'
import type { UserSession } from '@/types/session'

type EventCollectionResponse = {
  data: Array<EventType> | undefined,
  loading: boolean,
  updateEvent: (event: EventType) => void,
  deleteEvent: (id: EventType['id']) => void
}

type Props = {
  onlyFutureEvents?: boolean
  newestFirst?: boolean
}

export default function useEventCollection ({ onlyFutureEvents, newestFirst }: Props = { onlyFutureEvents: false, newestFirst: true }): EventCollectionResponse {
  const [events, setEvents] = useState <Array<EventType>>()
  const [loading, setLoading] = useState <boolean>(true)
  const session = useSession().data as UserSession
  const { calendar } = useContext(UserContext)

  useEffect(() => {
    const calendarId = calendar?.id ?? ''
    const accessToken = session?.accessToken ?? ''
    if (calendarId !== '' && accessToken !== '') {
      const params: GetEventsProps = { calendarId, accessToken: String(accessToken) }

      const today = new Date()
      params.since = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      if (!onlyFutureEvents) {
        // If we are not only looking for future events, we will look for events from the last year
        params.since.setFullYear(today.getFullYear() - 1)
        params.to = today
      }

      setLoading(true)
      listEvents(params).then((events: Array<EventType>) => {
        const sortedEvents = newestFirst ? events : events.reverse()
        setEvents(sortedEvents)
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
