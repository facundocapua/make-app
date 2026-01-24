import useDateTimeField from '@/components/Events/Fields/useDateTimeField'
import { CalendarIcon } from '@/components/Icons'
import { timeOptions } from '@/utils/datetime'

type Props = {
  id: string
  label: string
  value: string
  onChange: (date: string) => void
}

export default function DateTimeField({ id, label, value, onChange }: Props) {
  const { setOnlyDate, setOnlyTime, onlyDate, onlyTime } = useDateTimeField({ value, onChange })

  return (
    <>
      <label className="px-2 text-sm text-gray-200">{label}</label>
      <div className='p-2 mx-2 mt-2 mb-4 bg-white rounded-lg w-auto relative'>
        <input type="hidden" name={id} value={value} />
        <input
          id={`${id}-date`}
          className="outline-hidden w-28"
          onChange={(e) => setOnlyDate(e.target.value)}
          value={onlyDate}
          type='date'
        />
        <CalendarIcon className='custom-calendar-icon absolute w-5 h-5 text-gray-600 top-[10px] left-[105px] pointer-events-none' />
        <select id={`${id}-time`} className='ml-3 outline-hidden' value={onlyTime} onChange={(e) => setOnlyTime(e.target.value)}>
          {timeOptions.map((time) => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
      </div>
    </>
  )
}
