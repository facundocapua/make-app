import useEventCollection from '@/hooks/useEventCollection'
import { useEffect, useState } from 'react'
import type { EventType } from '@/types/event'
import EventModal from './EventModal'
import EventList from './EventList'
import { deleteEvent } from '@/services/api/deleteEvent'
import { formatDate } from '@/utils/format'

export type GroupedEventItemType = {
  date: string,
  events: Array<EventType>,
}

export type GroupedEventCollection = {
  [key: string]: GroupedEventItemType
}

const groupByDate = (events: Array<EventType>): Array<GroupedEventItemType> => {
  const groupedEvents = events.reduce((current: GroupedEventCollection, item) => {
    const startDate = new Date(item.date)
    startDate.setHours(23, 59, 59)
    const dateIndex = `${startDate.getFullYear()}_${startDate.getMonth()}_${startDate.getDate()}`
    current[dateIndex] ??= {
      date: startDate.toString(),
      events: []
    }
    current[dateIndex].events.push(item)
    return current
  }, {})
  const response = Object.values(groupedEvents)
  response.map((group) => {
    group.events.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateA.getTime() - dateB.getTime()
    })

    return group
  })
  return response
}

export default function GroupedEventList () {
  const { data, loading, updateEvent } = useEventCollection()
  const [groupedEvents, setGroupedEvents] = useState<Array<GroupedEventItemType>>()
  const [showModal, setShowModal] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<EventType | null>(null)
  const [scrollToToday, setScrollToToday] = useState(true)

  useEffect(() => {
    if (loading) {
      setScrollToToday(true)
    }

    if (!loading && data) {
      const groupedEvents = groupByDate(data)
      setGroupedEvents(groupedEvents)
    }
  }, [data, loading])

  useEffect(() => {
    if (scrollToToday && groupedEvents) {
      const today = new Date()
      const firstDate = groupedEvents.find(({ date }) => new Date(date) >= today)
      if (firstDate) {
        const interval = setInterval(() => {
          const element = document.getElementById(`events-${firstDate.date}`)
          if (element) {
            element.scrollIntoView()
            setScrollToToday(false)
            clearInterval(interval)
          }
        }, 100)
      }
    }
  }, [scrollToToday, groupedEvents])

  const handleItemClick = (event: EventType) => {
    setShowModal(true)
    setCurrentEvent(event)
  }

  const handleClose = () => {
    setShowModal(false)
    setCurrentEvent(null)
  }

  const handleItemDelete = (id: EventType['id']) => {
    deleteEvent({ id }).then(res => {
      console.log({ res })
    })
  }

  const handleUpdateItem = (event: EventType) => {
    console.log({ event })
    updateEvent(event)
    setCurrentEvent(event)
  }

  if (loading || !data) {
    return <>Loading...</>
  }

  return (
    <>
      {showModal && <EventModal event={currentEvent as EventType} onClose={handleClose} onEdit={handleUpdateItem} />}
      <section className='mx-4'>
        { groupedEvents && groupedEvents.map(({ date, events }: {date: string, events: Array<EventType>}) => {
          const isOld = new Date(date) < new Date()
          return (
            <div key={date} id={`events-${date}`} className='mb-4'>
              <h2 className={`text-xl font-bold ${isOld ? 'opacity-50' : ''}`}>{formatDate(date)}</h2>
              <EventList events={events} onItemClick={handleItemClick} onItemDelete={handleItemDelete} />
            </div>
          )
        })}
      </section>
    </>
  )
}
