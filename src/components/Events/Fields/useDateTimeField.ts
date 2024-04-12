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
    try {
      const newDate = new Date(`${onlyDate}T${onlyTime}`)
      onChange(newDate.toISOString())
    } catch (e) {
      console.log(`Problem with the date: ${onlyDate}T${onlyTime}`)
      console.error(e)
    }
  }, [onlyDate, onlyTime])

  return { onlyDate, onlyTime, setOnlyDate, setOnlyTime }
}
