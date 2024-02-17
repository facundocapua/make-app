import { ClockIcon } from '@/components/Icons'
import type { EventType } from '@/types/event'
import { formatTime, formatDisplayName } from '@/utils/format'
import clsx from 'clsx'

const heightForDuration = {
  30: 'h-10',
  45: 'h-14',
  60: 'h-20',
  90: 'h-28',
  120: 'h-36'
}

const EVENT_STATUS = {
  PENDING: 'peding',
  PROCESSING: 'processing',
  DONE: 'done'
} as const

const getStatus = (event: EventType): typeof EVENT_STATUS[keyof typeof EVENT_STATUS] => {
  const { date, duration } = event
  const today = new Date()
  const eventDate = new Date(date)
  if (eventDate < today) {
    eventDate.setMinutes(eventDate.getMinutes() + duration)
    const isNow = today < eventDate
    if (isNow) return EVENT_STATUS.PROCESSING

    return EVENT_STATUS.DONE
  }
  return EVENT_STATUS.PENDING
}

export default function EventItem ({ event }: { event: EventType }) {
  const { fullName, date, duration } = event
  const status = getStatus(event)

  return (
    <article className={clsx(
      'relative flex items-stretch mt-2 bg-gray-500 rounded-lg cursor-pointer drop-shadow-xs shadow-white-200 grow',
      heightForDuration[duration],
      { 'opacity-50': status === EVENT_STATUS.DONE },
      { 'animate-pulse': status === EVENT_STATUS.PROCESSING }
    )}>
      {status === EVENT_STATUS.PROCESSING
        ? (
          <div className='absolute right-0 bg-fuchsia-800 py-0.5 px-2 rounded-lg'>
            <span className='text-xs text-fuchsia-200'>Ahora</span>
          </div>
        )
        : null }

      <div className='flex items-center gap-1 px-4 text-lg text-gray-200 bg-gray-600 rounded-l-lg'>
        <ClockIcon className='w-3 h-3' />
        <small>{formatTime(date)}</small>
      </div>

      <div className='flex items-center p-2'>
        <h3 className='text-gray-100'>{formatDisplayName(fullName)} </h3> <small className='ml-1 text-xs text-gray-200'>({duration} mins)</small>
      </div>
    </article>
  )
}
