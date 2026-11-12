'use client'
import EventItem from './EventItem'

import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type
} from 'react-swipeable-list'
import 'react-swipeable-list/dist/styles.css'
import type { EventType } from '@/types/event'
import DeleteIcon from '../Icons/DeleteIcon'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { deleteItem } from './event-modal/actions'
import { formatDisplayName } from '@/utils/format'

const trailingActions = ({ event, onItemDelete }: {event: EventType, onItemDelete: (event: EventType) => void}) => (
  <TrailingActions>
    <SwipeAction
      onClick={() => onItemDelete(event)}
    >
      <button className='flex items-center justify-center w-12 pr-3 mt-2 text-center text-white bg-red-500 rounded-lg'>
        <DeleteIcon className='items-center w-8 h-8' />
      </button>
    </SwipeAction>
  </TrailingActions>
)

type Props = {
  events: Array<EventType>
  // Lets a list that keeps its own events remove one, instead of reloading the page
  onDelete?: (event: EventType) => void
}

export default function EventList ({ events, onDelete }: Props) {
  const router = useRouter()
  const handleItemClick = (event: EventType) => {
    router.push(`/event/${event.id}`)
  }

  const handleItemDelete = async (event: EventType) => {
    if (!window.confirm(`¿Eliminar el turno de ${formatDisplayName(event.fullName)}? No se puede deshacer.`)) return

    const { ok } = await deleteItem(event.id).catch(() => ({ ok: false }))
    if (!ok) {
      toast.error('No se pudo eliminar el turno', { position: 'top-center' })
      return
    }

    toast.success('Turno eliminado', { position: 'top-center' })
    if (onDelete) {
      onDelete(event)
    } else {
      router.refresh()
    }
  }

  if (!events || !events.length) {
    return <p className='text-center'>No hay eventos</p>
  }

  return (
    <SwipeableList fullSwipe={true} type={Type.IOS}>
      {events.map((event: EventType) => (
        <SwipeableListItem
          key={event.id}
          onClick={() => handleItemClick(event)}
          trailingActions={trailingActions({ event, onItemDelete: handleItemDelete })}
        >
          <EventItem event={event} />
        </SwipeableListItem>
      ))}
    </SwipeableList>
  )
}
