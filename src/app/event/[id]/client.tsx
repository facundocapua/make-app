'use client'

import EventModal from '@/components/Events/EventModal'
import type { EventType } from '@/types/event'

type Props = {
  event: EventType
}

export default function EventsPageClient ({ event }: Props) {
  return (
    <EventModal event={event} />
  )
}
