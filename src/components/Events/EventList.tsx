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
import { deleteItem } from './event-modal/actions'

const trailingActions = ({ event, onItemDelete }: {event: EventType, onItemDelete: (event: EventType) => void}) => (
  <TrailingActions>
    <SwipeAction
      destructive={true}
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
}

export default function EventList ({ events }: Props) {
  const router = useRouter()
  const handleItemClick = (event: EventType) => {
    router.push(`/event/${event.id}`)
  }

  const handleItemDelete = async (event: EventType) => {
    await deleteItem(event.id)
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
