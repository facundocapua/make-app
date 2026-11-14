import { zonedDateTime } from '@/utils/datetime'
import { formatDateComputer, formatTime } from '@/utils/format'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
}

type Return = {
  onlyDate: string
  onlyTime: string
  setOnlyDate: Dispatch<SetStateAction<string>>
  setOnlyTime: Dispatch<SetStateAction<string>>
}

export default function useDateTimeField ({ value, onChange }: Props): Return {
  const [onlyDate, setOnlyDate] = useState(formatDateComputer(value))
  const [onlyTime, setOnlyTime] = useState(formatTime(value))

  useEffect(() => {
    const newDate = zonedDateTime(onlyDate, onlyTime)
    // A date input being cleared or typed in gives an invalid date until it is complete
    if (!Number.isNaN(newDate.getTime())) onChange(newDate.toISOString())
  }, [onlyDate, onlyTime])

  return { onlyDate, onlyTime, setOnlyDate, setOnlyTime }
}
