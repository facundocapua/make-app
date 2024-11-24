'use client'
import type { EventType } from '@/types/event'
import { CloseIcon } from '../Icons'
import DisplayNameInfo from './Fields/display-name-new'
import EventTime from './Fields/event-time'
import PrinceInfo from './event-modal/price-info'
import NotesField from './Fields/notes-field-new'
import { EVENT_STATUS, getEventStatus } from '@/utils/events'
import { updateEventAction } from './event-modal/actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import UploadEventPhoto from './event-modal/upload-event-photo'
import Spinner from '../Ui/Spinner'
import ShareDateButton from './event-modal/share-date-button'
import RequestReviewButton from './event-modal/request-review-button'
import { formatDateComputer } from '@/utils/format'

type Props = {
  event: EventType
}
export default function EventModal ({ event }: Props) {
  const { fullName, date, duration, price, deposit, notes } = event
  const [isSaving, setIsSaving] = useState(false)
  const status = getEventStatus(event)

  const router = useRouter()

  const handleNameChange = (fullName: string) => {
    setIsSaving(true)
    updateEventAction({ ...event, fullName })
      .then(() => setIsSaving(false))
  }

  const handleDateChange = (date: string) => {
    setIsSaving(true)
    updateEventAction({ ...event, date })
      .then(() => setIsSaving(false))
  }

  const handlePriceChange = (price: number, deposit: number) => {
    setIsSaving(true)
    updateEventAction({ ...event, price, deposit })
      .then(() => setIsSaving(false))
  }

  const handleNotesChange = (value: string) => {
    setIsSaving(true)
    updateEventAction({ ...event, notes: value })
      .then(() => setIsSaving(false))
  }

  const handleClose = () => {
    const dateAnchor = formatDateComputer(date)
    if (status === EVENT_STATUS.DONE) {
      router.push(`/archive#${dateAnchor}`)
      return
    }
    router.push(`/#${dateAnchor}`)
  }

  return (
    <>
      <div className='fixed top-0 bottom-0 left-0 right-0 z-10 bg-white opacity-50' onClick={() => handleClose()}>
      </div>
      <div className='fixed z-20 max-w-lg p-4 pt-8 mx-auto bg-gray-700 rounded-lg shadow-md left-4 right-4 shadow-gray-400/40'>
        {isSaving && (
          <div className='absolute top-1 left-1'>
            <Spinner className='w-8 h-8 text-gray-600' />
          </div>
        )}
        <button className='absolute p-2 text-white bg-gray-500 rounded-full -right-2 -top-4' onClick={() => handleClose()}><CloseIcon className='w-4 h-4' /></button>
        <div className='grid gap-6'>
          <DisplayNameInfo name={fullName} onChange={handleNameChange} />

          <EventTime date={date} duration={duration} onDateChange={handleDateChange} />

          <PrinceInfo price={price} deposit={deposit} onChange={handlePriceChange} />

          <NotesField value={notes ?? ''} onChange={handleNotesChange} />

          <UploadEventPhoto event={event} />

          <div>
            {status !== EVENT_STATUS.DONE && <ShareDateButton event={event} />}
            {status === EVENT_STATUS.DONE && <RequestReviewButton event={event} />}
          </div>
        </div>
      </div>
    </>
  )
}
