import { useEffect, useState } from 'react'
import type { EventType } from '@/types/event'
import EventModal from './EventModal'
import EventList from './EventList'
import { formatDate } from '@/utils/format'
import Spinner from '../Ui/Spinner'
import useGroupedEvents from './hooks/useGroupedEvents'

export default function GroupedEventList () {
  const { data, loading, updateEvent, deleteEvent, firstDate } = useGroupedEvents({ onlyFutureEvents: true })
  const [showModal, setShowModal] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<EventType | null>(null)
  const [scrollToToday, setScrollToToday] = useState(true)

  useEffect(() => {
    if (scrollToToday && firstDate) {
      const interval = setInterval(() => {
        const element = document.getElementById(`events-${firstDate}`)
        if (element) {
          element.scrollIntoView()
          setScrollToToday(false)
          clearInterval(interval)
        }
      }, 100)
    }
  }, [scrollToToday, firstDate])

  const handleItemClick = (event: EventType) => {
    setShowModal(true)
    setCurrentEvent(event)
  }

  const handleClose = () => {
    setShowModal(false)
    setCurrentEvent(null)
  }

  const handleItemDelete = (id: EventType['id']) => {
    deleteEvent(id)
  }

  const handleUpdateItem = (event: EventType) => {
    updateEvent(event)
    setCurrentEvent(event)
  }

  if (loading || !data) {
    return <Spinner />
  }

  if (data.length === 0) {
    return <div className='mt-10 text-center text-gray-100'>No se encontraron eventos</div>
  }

  return (
    <>
      {showModal && <EventModal event={currentEvent as EventType} onClose={handleClose} onEdit={handleUpdateItem} />}
      <section className='mx-4'>
        { data && data.map(({ date, events }: {date: string, events: Array<EventType>}) => {
          const isOld = new Date(date) < new Date()
          return (
            <div key={date} id={`events-${date}`} className='mb-4'>
              <h2 className={`text-xl font-bold text-gray-100 ${isOld ? 'opacity-60' : ''}`}>{formatDate(date)}</h2>
              <EventList events={events} onItemClick={handleItemClick} onItemDelete={handleItemDelete} />
            </div>
          )
        })}
      </section>
    </>
  )
}
