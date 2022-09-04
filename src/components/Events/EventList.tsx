import { useSession } from 'next-auth/react'
import useEventCollection from '@/hooks/useEventCollection'
import EventItem from './EventItem'
import TimelineContainer from '../Timeline/TimelineContainer'
import TimelineItem from '../Timeline/TimelineItem'
import type { EventItemType } from '@/services/google'

const formatDate = (date:string): string => {
  const dateObj = new Date(date)
  const options = {
    day: 'numeric',
    month: 'long'
  }

  return dateObj.toLocaleDateString('es-AR', options)
}

export default function EventList () {
  const { data: session } = useSession()

  if (!session) {
    return <>You need to login</>
  }

  const { data, loading } = useEventCollection()

  if (loading || !data) {
    return <>Loading...</>
  }

  return (
    <section className='mx-4'>
      { data.map(({ date, events }: {date: string, events: Array<EventItemType>}) => (
        <div key={date} className='mb-4'>
          <h2 className='text-xl font-bold'>{formatDate(date)}</h2>
          <ol>
            {events.map((event: EventItemType) => (
              <li key={event.id}>
                <EventItem event={event} />
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  )
}
