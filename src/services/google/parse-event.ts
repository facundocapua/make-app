import type { EventType } from '@/types/event'
import { durationOptions } from '@/utils/datetime'
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

export const parseGoogleEvent = (item: GoogleEventType): EventType => {
  try {
    const data = JSON.parse(item.description ?? '')
    if (isStoredEvent(data)) {
      return { ...data, id: item.id }
    }
  } catch {
    // Events created directly in Google Calendar don't have a JSON description
  }

  const date = item.start?.dateTime ?? item.start?.date ?? ''
  const end = item.end?.dateTime ?? item.end?.date ?? date
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
