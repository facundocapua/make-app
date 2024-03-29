import DateField from './Fields/DateField'

type Props = {
  date: string
  duration: number
  onDateChange: (date: string) => void
}

export default function EventTimeInfo ({ date, onDateChange } : Props) {
  return (
    <div className='flex items-center text-gray-200'>
      ¿Cuándo?
      <DateField date={date} onChange={onDateChange} />
    </div>
  )
}
