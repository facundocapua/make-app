import { formatDateComputer, formatTime } from '@/utils/format'
import { useEffect, useState, Dispatch, SetStateAction } from 'react'

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
    const newDate = new Date(`${onlyDate}T${onlyTime}`)
    onChange(newDate.toISOString())
  }, [onlyDate, onlyTime])

  return { onlyDate, onlyTime, setOnlyDate, setOnlyTime }
}
