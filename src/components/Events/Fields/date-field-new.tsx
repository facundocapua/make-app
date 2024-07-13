import { CheckIcon, EditIcon } from '@/components/Icons'
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

  const { editing, setNewValue, handleShowInput, handleConfirm } = useEditInline({ value: formatDateComputer(date), onChange })

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
      <div className='flex items-center gap-2 text-gray-200' onClick={handleShowInput}>
        <span className='p-1 w-[180px]'>{formatDateTime(date)}</span>
        <EditIcon className='w-5 h-5 ml-1 text-gray-200' />
      </div>
    )
  }

  return (
    <div className='flex items-center gap-2'>
      <div className='p-1 bg-gray-500 rounded-lg w-[210px] text-gray-200'>
        <input
          className="w-[120px] bg-gray-500 outline-none m-0 p-0 leading-none"
          onChange={(e) => setOnlyDate(e.target.value)}
          value={onlyDate}
          type='date'
        />
        <select className='ml-1 bg-gray-500 p-0 outline-none' value={onlyTime} onChange={(e) => setOnlyTime(e.target.value)}>
          { timeOptions.map((time) => (
            <option key={time} value={time}>{time}</option>
          )) }
        </select>
      </div>
      <button onClick={handleConfirm}>
        <CheckIcon className='w-5 h-5 ml-1 text-gray-200' />
      </button>
    </div>

  )
}
