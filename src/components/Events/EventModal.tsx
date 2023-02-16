import { EventType } from '@/types/event'
import { CloseIcon, ShareIcon } from '../Icons'
import DisplayNameInfo from './Fields/DisplayName'
import EventTimeInfo from './EventTimeInfo'
import PrinceInfo from './PrinceInfo'
import NotesField from './Fields/NotesField'
import { formatDateShort, formatTime } from '@/utils/format'

type Props = {
  event: EventType
  onClose: () => void
  onEdit: (event: EventType) => void
}
export default function EventModal ({ event, onClose, onEdit }: Props) {
  const { fullName, date, duration, price, deposit, notes } = event
  const handleNameChange = (fullName: string) => {
    onEdit({ ...event, fullName })
  }

  const handleDateChange = (date: string) => {
    onEdit({ ...event, date })
  }

  const handlePriceChange = (deposit: number) => {
    onEdit({ ...event, deposit })
  }

  const handleNotesChange = (value: string) => {
    onEdit({ ...event, notes: value })
  }

  const handleShare = async () => {
    const day = formatDateShort(date)
    const time = formatTime(date)
    const balance = Math.round(price - deposit)
    const url = 'https://www.makeapp.ar/date.jpg'
    const res = await fetch(url)
    const blob = await res.blob()
    console.log(res)
    const shareData = {
      files: [
        new File([blob],
          'turno.jpg',
          {
            type: blob.type,
            lastModified: new Date().getTime()
          }
        )
      ],

      title: 'Tu turno',
      text: `Hola ${fullName}! 
Tu turno es el 🗓️ *${day}* a las 🕐 *${time}*. 
Te resta por pagar 💰 *$${balance}*

Te espero en mi estudio 🏠 Garibaldi 1082
Se solicita puntualidad.

Te espero!
`
    }
    console.log(shareData)
    if (navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log(url)
    }
  }

  return (
    <>
      <div className='fixed top-0 bottom-0 left-0 right-0 z-10 bg-white opacity-50' onClick={() => onClose()}>
      </div>
      <div className='fixed z-20 max-w-lg p-4 mx-auto bg-gray-700 rounded-lg shadow-md left-4 right-4 top-1/3 shadow-gray-400/40'>
        <button className='absolute p-2 text-white bg-gray-500 rounded-full -right-1 -top-1' onClick={() => onClose()}><CloseIcon className='w-4 h-4' /></button>
        <DisplayNameInfo name={fullName} onChange={handleNameChange} />
        <EventTimeInfo date={date} duration={duration} onDateChange={handleDateChange} />

        <div className='my-4'>
          <PrinceInfo price={price} deposit={deposit} onChange={handlePriceChange} />
        </div>

        <div className='my-4'>
          <NotesField value={notes ?? ''} onChange={handleNotesChange} />
        </div>

        <div>
          <button onClick={handleShare}><ShareIcon className='w-6 h-6 text-gray-300 opacity-70 hover:opacity-100' /></button>
        </div>
      </div>
    </>
  )
}
