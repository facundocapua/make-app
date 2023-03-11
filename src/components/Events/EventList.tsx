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

type TrailingActionsProps = {
  id: EventType['id']
}

type Props = {
  events: Array<EventType>,
  onItemClick: (event: EventType) => void
  onItemDelete: (id: EventType['id']) => void
}

export default function EventList ({ events, onItemClick, onItemDelete }: Props) {
  const trailingActions = ({ id }: TrailingActionsProps) => (
    <TrailingActions>
      <SwipeAction
        destructive={true}
        onClick={() => onItemDelete(id)}
      >
        <button className='flex items-center justify-center w-12 pr-3 mt-2 text-center text-white bg-red-500 rounded-lg'>
          <DeleteIcon className='items-center w-8 h-8' />
        </button>
      </SwipeAction>
    </TrailingActions>
  )

  if (!events || !events.length) {
    return <p className='text-center'>No hay eventos</p>
  }

  return (
    <>
      <SwipeableList fullSwipe={true} type={Type.IOS}>
        {events.map((event: EventType) => (
          <SwipeableListItem
            key={event.id}
            onClick={() => onItemClick(event)}
            trailingActions={trailingActions({ id: event.id })}
          >
            <EventItem event={event} />
          </SwipeableListItem>
        ))}
      </SwipeableList>
    </>
  )
}
