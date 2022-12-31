import { ClockIcon } from '@/components/Icons'
import { EventType } from '@/types/event'
import { formatTime } from '@/utils/date'

export default function EventItem ({ event }: { event: EventType }) {
  const { fullName, date } = event
  const isOld = new Date(date) < new Date()

  return (
    <article className={`flex items-stretch mt-2 bg-red-100 rounded-lg cursor-pointer drop-shadow-xs shadow-red-200 grow ${isOld ? 'opacity-40' : ''}`}>
      <div className='flex items-center gap-1 px-4 text-lg bg-red-200 rounded-l-lg'>
        <ClockIcon className='w-3 h-3' />
        <small>{formatTime(date)}</small>
      </div>

      <div className='p-2'>
        <h3>{fullName}</h3>
      </div>
    </article>
  )
}
