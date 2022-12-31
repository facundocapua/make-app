import type { EventType } from '@/types/event'

export const saveEvent = (event: Partial<EventType>): Promise<EventType> => {
  return fetch('/api/events/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })
    .then(res => res.json())
}
