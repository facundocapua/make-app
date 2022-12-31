import { EventType } from '@/types/event'
import { formatDateTime } from '@/utils/date'
import { CloseIcon } from '../Icons'
import PrinceInfo from './PrinceInfo'

type Props = {
  event: EventType
  onClose: () => void
  onEdit: (event: EventType) => void
}
export default function EventModal ({ event, onClose, onEdit }: Props) {
  const handlePriceChange = (deposit: number) => {
    onEdit({ ...event, deposit })
  }
  return (
    <>
      <div className='fixed top-0 bottom-0 left-0 right-0 z-10 bg-white opacity-50' onClick={() => onClose()}>
      </div>
      <div className='fixed z-20 p-4 rounded-lg shadow-md left-4 right-4 top-1/3 bg-rose-200 shadow-rose-400/40'>
        <button className='absolute p-2 text-white bg-red-500 rounded-full -right-1 -top-1' onClick={() => onClose()}><CloseIcon className='w-4 h-4' /></button>
        <h1 className="text-2xl font-bold">{event.fullName}</h1>
        <p className="text-sm">{formatDateTime(event.date)}</p>

        <div className='my-4'>
          <PrinceInfo price={event.price} deposit={event.deposit} onChange={handlePriceChange} />
        </div>
      </div>
    </>
  )
}
