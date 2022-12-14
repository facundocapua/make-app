import { ClockIcon } from '@/components/Icons'
import { EventType } from '@/types/event'
import { formatTime, formatDisplayName } from '@/utils/format'

const heightForDuration = {
  30: 'h-10',
  45: 'h-14',
  60: 'h-20',
  90: 'h-28',
  120: 'h-36'
}

export default function EventItem ({ event }: { event: EventType }) {
  const { fullName, date, duration } = event
  const isOld = new Date(date) < new Date()

  return (
    <article className={`flex items-stretch mt-2 bg-red-100 rounded-lg cursor-pointer drop-shadow-xs shadow-red-200 grow ${heightForDuration[duration]} ${isOld ? 'opacity-40' : ''}`}>
      <div className='flex items-center gap-1 px-4 text-lg bg-red-200 rounded-l-lg'>
        <ClockIcon className='w-3 h-3' />
        <small>{formatTime(date)}</small>
      </div>

      <div className='flex items-center p-2'>
        <h3>{formatDisplayName(fullName)} </h3> <small className='ml-1 text-xs text-stone-500'>({duration} mins)</small>
      </div>
    </article>
  )
}
