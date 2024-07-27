'use client'

import type { EventType } from '@/types/event'
import { formatDate, formatDateComputer } from '@/utils/format'
import EventList from './EventList'

type Props = {
  data: Array<{ date: string, events: Array<EventType> }>
}
export default function EventsGroupList ({ data }: Props) {
  return (
    <section className='mx-4'>
      { data && data.map(({ date, events }: {date: string, events: Array<EventType>}) => {
        const isOld = new Date(date) < new Date()
        return (
          <div key={date} id={`events-${date}`} className='mb-4'>
            <h2 id={formatDateComputer(date)} className={`text-xl font-bold text-gray-100 ${isOld ? 'opacity-60' : ''}`}>{formatDate(date)}</h2>
            <EventList events={events} />
          </div>
        )
      })}
    </section>
  )
}
