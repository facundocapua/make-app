import useEventCollection from '@/hooks/useEventCollection'
import type { EventType, GroupedEventItemType } from '@/types/event'
import { groupByDate } from '@/utils/events'
import { useEffect, useState } from 'react'

type Response = {
  data: Array<GroupedEventItemType> | undefined,
  loading: boolean,
  updateEvent: (event: EventType) => void,
  deleteEvent: (id: EventType['id']) => void,
  firstDate: string | undefined,
}

type Props = {
  onlyFutureEvents: boolean
  newestFirst?: boolean
}

export default function useGroupedEvents ({ onlyFutureEvents, newestFirst = true }: Props = { onlyFutureEvents: true, newestFirst: true }): Response {
  const { data, loading, updateEvent, deleteEvent } = useEventCollection({ onlyFutureEvents, newestFirst })
  const [groupedEvents, setGroupedEvents] = useState<Array<GroupedEventItemType>>()
  const [firstDate, setFirstDate] = useState<string>()

  useEffect(() => {
    if (!loading && data) {
      const groupedEvents = groupByDate(data)
      setGroupedEvents(groupedEvents)
      const today = new Date()
      const firstDate = [...groupedEvents]
        .sort((a, b) => {
          const aDate = new Date(a.date)
          const diffA = Math.abs(aDate.getTime() - today.getTime())
          const bDate = new Date(b.date)
          const diffB = Math.abs(bDate.getTime() - today.getTime())

          return diffA - diffB
        }).at(0)
      setFirstDate(firstDate?.date)
    }
  }, [data, loading])

  return { data: groupedEvents, loading, updateEvent, deleteEvent, firstDate }
}
