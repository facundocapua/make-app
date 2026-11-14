import type { EventType } from '@/types/event'
import { hasEventsBefore, listEvents } from '@/services/google'

export type ArchiveYear = {
  // Newest first
  events: Array<EventType>
  // Where the next, older, year ends; null when there is nothing older
  nextBefore: string | null
}

type Props = {
  calendarId: string
  accessToken: string
  since: Date
  to: Date
}

export const getArchiveYear = async ({ calendarId, accessToken, since, to }: Props): Promise<ArchiveYear> => {
  const [events, hasOlder] = await Promise.all([
    listEvents({ calendarId, accessToken, since, to }),
    hasEventsBefore({ calendarId, accessToken, before: since })
  ])

  return {
    events: events.reverse(),
    nextBefore: hasOlder ? since.toISOString() : null
  }
}
