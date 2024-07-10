'use client'

import EventModal from '@/components/Events/EventModal'
import type { EventType } from '@/types/event'
import { useRouter } from 'next/navigation'

type Props = {
  event: EventType
}

export default function EventsPageClient ({ event }: Props) {
  const router = useRouter()
  const handleClose = () => {
    router.back()
  }
  return (
    <EventModal event={event} onClose={handleClose} onEdit={() => {}} />
  )
}
