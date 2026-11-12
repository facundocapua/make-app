'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { EventType } from '@/types/event'
import EventsGroupList from '@/components/Events/events-group-list'
import Spinner from '@/components/Ui/Spinner'
import { appendOlderEvents } from '@/utils/archive'
import { groupByDate } from '@/utils/events'
import { loadArchiveYearAction } from './actions'

type Props = {
  initialEvents: Array<EventType>
  initialNextBefore: string | null
}

export default function ArchiveList ({ initialEvents, initialNextBefore }: Props) {
  const [events, setEvents] = useState(initialEvents)
  const [nextBefore, setNextBefore] = useState(initialNextBefore)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [inView, setInView] = useState(false)
  const sentinel = useRef<HTMLDivElement>(null)
  // State updates land after the next render, and React can run the effect below twice before that
  const requested = useRef<string | null>(null)

  const groups = useMemo(() => groupByDate(events), [events])

  useEffect(() => {
    const element = sentinel.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '400px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const loadOlder = async () => {
    if (!nextBefore || requested.current === nextBefore) return
    requested.current = nextBefore

    setLoading(true)
    setFailed(false)
    try {
      const older = await loadArchiveYearAction(nextBefore)
      setEvents(current => appendOlderEvents(current, older.events))
      setNextBefore(older.nextBefore)
    } catch {
      requested.current = null
      setFailed(true)
    } finally {
      setLoading(false)
    }
  }

  // Keeps loading while the end of the list is visible, which also skips years without appointments
  useEffect(() => {
    if (inView && !failed) loadOlder()
  }, [inView, nextBefore, loading, failed])

  const handleDelete = (deleted: EventType) => {
    setEvents(current => current.filter(({ id }) => id !== deleted.id))
  }

  return (
    <>
      {(groups.length > 0 || !nextBefore) && <EventsGroupList data={groups} onDelete={handleDelete} />}
      <div ref={sentinel} className='mx-4 mb-8 text-center text-gray-200'>
        {loading && <Spinner className='w-8 h-8' />}
        {failed && (
          <button className='px-4 py-2 rounded-lg bg-gray-600' onClick={loadOlder}>
            No se pudieron cargar turnos anteriores. Reintentar
          </button>
        )}
      </div>
    </>
  )
}
