import type { EventType, GroupedEventCollection, GroupedEventItemType } from '@/types/event'

export const groupByDate = (events: Array<EventType>): Array<GroupedEventItemType> => {
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

export const EVENT_STATUS = {
  PENDING: 'peding',
  PROCESSING: 'processing',
  DONE: 'done'
} as const

export const getEventStatus = (event: EventType): typeof EVENT_STATUS[keyof typeof EVENT_STATUS] => {
  const { date, duration } = event
  const today = new Date()
  const eventDate = new Date(date)
  if (eventDate < today) {
    eventDate.setMinutes(eventDate.getMinutes() + duration)
    const isNow = today < eventDate
    if (isNow) return EVENT_STATUS.PROCESSING

    return EVENT_STATUS.DONE
  }
  return EVENT_STATUS.PENDING
}
