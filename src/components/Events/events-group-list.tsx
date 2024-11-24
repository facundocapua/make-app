'use client'

import type { EventType } from '@/types/event'
import { formatDate, formatDateComputer } from '@/utils/format'
import EventList from './EventList'
import { useEffect } from 'react'

type Props = {
  data: Array<{ date: string, events: Array<EventType> }>
}
export default function EventsGroupList ({ data }: Props) {
  useEffect(() => {
    // Check if we are in a client-side environment
    if (typeof window !== 'undefined') {
      // Access the anchor using window.location.hash
      const anchor = window.location.hash
      const date = anchor.replace('#', '')
      document.getElementById(date)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      console.log('Anchor:', anchor)
    }
  }, [])

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
