import { EventItem as EventItemType } from '@/services/google'
import { ClockIcon } from '@/components/Icons'

const formatTime = (date:string): string => {
  const dateObj = new Date(date)
  const options = {
    hour: '2-digit',
    minute: '2-digit'
  }
  return dateObj.toLocaleString('es-AR', options)
}

export default function EventItem ({ event }: { event: EventItemType }) {
  const { summary, description, start, end } = event
  const data = JSON.parse(description)

  return (
    <article className="flex gap-2 mt-2 items-center">
      <div className='text-lg flex gap-1 items-center'>
        <ClockIcon className='w-3 h-3' />
        <small>{formatTime(start.dateTime)}</small>
      </div>

      <div className='bg-red-100 p-2 rounded-lg drop-shadow-xs shadow-red-200 grow'>
        <h3>{summary}</h3>
      </div>
    </article>
  )
}
