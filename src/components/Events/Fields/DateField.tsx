import { CancelIcon, CheckIcon, EditIcon } from '@/components/Icons'
import { timeOptions } from '@/utils/datetime'
import { formatDateComputer, formatDateTime, formatTime } from '@/utils/format'
import { useEffect, useState } from 'react'
import useEditInline from '../useEditInline'

type Props = {
  date: string
  onChange: (date: string) => void
}

export default function DateField ({ date, onChange }: Props) {
  const [onlyDate, setOnlyDate] = useState(formatDateComputer(date))
  const [onlyTime, setOnlyTime] = useState(formatTime(date))

  const { editing, setNewValue, handleShowInput, handleCancel, handleConfirm } = useEditInline({ value: formatDateComputer(date), onChange })

  useEffect(() => {
    try {
      const newDate = new Date(`${onlyDate}T${onlyTime}`)
      setNewValue(newDate.toISOString())
    } catch (e) {
      console.log(`Problem with the date: ${onlyDate}T${onlyTime}`)
      console.error(e)
    }
  }, [onlyDate, onlyTime])

  if (!editing) {
    return (
      <div className='flex items-center' onClick={handleShowInput}>
        <p className="ml-2 text-sm">{formatDateTime(date)}</p>
        <EditIcon className='w-3 h-3 ml-1 text-gray-400' />
      </div>
    )
  }

  return (
    <div className='relative flex items-center ml-2'>
      <div className='p-1 bg-gray-500 rounded-lg w-50 w-60'>
        <input
          className="w-24 text-sm bg-gray-500 outline-hidden"
          onChange={(e) => setOnlyDate(e.target.value)}
          value={onlyDate}
          type='date'
        />
        <select className='ml-1 text-sm bg-gray-500 outline-hidden' value={onlyTime} onChange={(e) => setOnlyTime(e.target.value)}>
          { timeOptions.map((time) => (
            <option key={time} value={time}>{time}</option>
          )) }
        </select>
      </div>
      <button className='absolute px-2 py-1 bg-gray-200 rounded-sm right-10 bottom-1' onClick={handleConfirm}>
        <CheckIcon className='w-4 h-4 text-gray-400' />
      </button>
      <button className='absolute px-2 py-1 bg-gray-400 rounded-sm right-1 bottom-1' onClick={handleCancel}>
        <CancelIcon className='w-4 h-4 text-gray-200' />
      </button>
    </div>

  )
}
