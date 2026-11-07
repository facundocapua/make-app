import type { EventType } from '@/types/event'
import { durationOptions, zonedDateTime } from '@/utils/datetime'
import type { GoogleEventType } from './types'

const DURATIONS = durationOptions.map(Number)

const isStoredEvent = (value: unknown): value is Omit<EventType, 'id'> => {
  return typeof value === 'object' && value !== null && typeof (value as EventType).date === 'string'
}

const getClosestDuration = (minutes: number) => {
  return DURATIONS.reduce((closest, duration) => {
    return Math.abs(duration - minutes) < Math.abs(closest - minutes) ? duration : closest
  }) as EventType['duration']
}

// All-day events only have a day, which would otherwise be read as midnight UTC: the evening before in Argentina
const getAllDayStart = (day = '') => {
  const start = zonedDateTime(day, '00:00')
  return Number.isNaN(start.getTime()) ? day : start.toISOString()
}

export const parseGoogleEvent = (item: GoogleEventType): EventType => {
  try {
    const data = JSON.parse(item.description ?? '')
    if (isStoredEvent(data)) {
      return { ...data, id: item.id }
    }
  } catch {
    // Events created directly in Google Calendar don't have a JSON description
  }

  const date = item.start?.dateTime ?? getAllDayStart(item.start?.date)
  const end = item.end?.dateTime ?? (item.end?.date ? getAllDayStart(item.end.date) : date)
  const minutes = (new Date(end).getTime() - new Date(date).getTime()) / 60000

  return {
    id: item.id,
    fullName: item.summary ?? '',
    date,
    price: 0,
    deposit: 0,
    duration: getClosestDuration(minutes),
    includesTest: false,
    notes: item.description ?? ''
  }
}
