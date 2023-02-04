import { EventType } from '@/types/event'
import { CloseIcon } from '../Icons'
import DisplayNameInfo from './Fields/DisplayName'
import EventTimeInfo from './EventTimeInfo'
import PrinceInfo from './PrinceInfo'

type Props = {
  event: EventType
  onClose: () => void
  onEdit: (event: EventType) => void
}
export default function EventModal ({ event, onClose, onEdit }: Props) {
  const { fullName, date, duration, price, deposit } = event
  const handleNameChange = (fullName: string) => {
    console.log({ fullName })
    onEdit({ ...event, fullName })
  }

  const handleDateChange = (date: string) => {
    onEdit({ ...event, date })
  }

  const handlePriceChange = (deposit: number) => {
    onEdit({ ...event, deposit })
  }
  return (
    <>
      <div className='fixed top-0 bottom-0 left-0 right-0 z-10 bg-white opacity-50' onClick={() => onClose()}>
      </div>
      <div className='fixed z-20 max-w-lg p-4 mx-auto rounded-lg shadow-md left-4 right-4 top-1/3 bg-rose-200 shadow-rose-400/40'>
        <button className='absolute p-2 text-white bg-red-500 rounded-full -right-1 -top-1' onClick={() => onClose()}><CloseIcon className='w-4 h-4' /></button>
        <DisplayNameInfo name={fullName} onChange={handleNameChange} />
        <EventTimeInfo date={date} duration={duration} onDateChange={handleDateChange} />

        <div className='my-4'>
          <PrinceInfo price={price} deposit={deposit} onChange={handlePriceChange} />
        </div>
      </div>
    </>
  )
}
