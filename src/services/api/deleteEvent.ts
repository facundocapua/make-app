import { EventType } from '@/types/event'

type Props = {
  id: EventType['id']
}
export const deleteEvent = ({ id }: Props) => {
  return fetch(`/api/events/${id}`, {
    method: 'DELETE'
  })
}
