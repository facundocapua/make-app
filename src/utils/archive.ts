import type { EventType } from '@/types/event'
import { startOfZonedDay } from './datetime'

// The archive loads one year at a time, newest first. Each year ends where the newer one starts, so there are no gaps.
export const getYearBefore = (to: Date): Date => {
  const since = new Date(to)
  since.setUTCFullYear(since.getUTCFullYear() - 1)
  return since
}

// The first year ends now, and starts at midnight one year ago, so it covers today's earlier appointments too
export const getFirstArchiveYear = (now: Date) => ({
  since: getYearBefore(startOfZonedDay(now)),
  to: now
})

// Calendar returns an event in both years when it crosses the boundary between them
export const appendOlderEvents = (events: Array<EventType>, older: Array<EventType>): Array<EventType> => {
  const ids = new Set(events.map(({ id }) => id))
  return [...events, ...older.filter(({ id }) => !ids.has(id))]
}
