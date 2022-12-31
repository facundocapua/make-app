import { EventType } from '@/types/event'

export const updateEvent = (event: EventType): Promise<EventType> => {
  return fetch(`/api/events/${event.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })
    .then(res => res.json())
}
