import { ClockIcon } from '@/components/Icons'
import type { EventType } from '@/types/event'
import { EVENT_STATUS, getEventStatus } from '@/utils/events'
import { formatTime, formatDisplayName } from '@/utils/format'
import clsx from 'clsx'

const heightForDuration = {
  30: 'h-10',
  45: 'h-14',
  60: 'h-20',
  90: 'h-28',
  120: 'h-36'
}

export default function EventItem ({ event }: { event: EventType }) {
  const { fullName, date, duration } = event
  const status = getEventStatus(event)

  return (
    <article className={clsx(
      'relative flex items-stretch mt-2 bg-gray-500 rounded-lg cursor-pointer drop-shadow-xs shadow-white-200 grow',
      heightForDuration[duration],
      { 'opacity-50': status === EVENT_STATUS.DONE }
      // { 'bg-sky-500': status === EVENT_STATUS.PROCESSING }
    )}>
      {status === EVENT_STATUS.PROCESSING
        ? (
          <div className='absolute right-1 top-1 bg-slate-800 py-0.5 px-2 rounded-lg'>
            <span className='text-xs text-slate-100'>Ahora</span>
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
