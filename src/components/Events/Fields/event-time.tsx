import DateField from './date-field-new'

type Props = {
  date: string
  duration: number
  onDateChange: (date: string) => void
}

export default function EventTime ({ date, onDateChange } : Props) {
  return (
    <div className="flex items-center justify-between">
      <div className='font-medium text-gray-300'>Fecha</div>
      <DateField date={date} onChange={onDateChange} />
    </div>
  )
}
