import useDateTimeField from '@/components/Events/Fields/useDateTimeField'
import { timeOptions } from '@/utils/datetime'

type Props = {
  id: string
  label: string
  value: string
  onChange: (date: string) => void
}

export default function DateTimeField ({ id, label, value, onChange }: Props) {
  const { setOnlyDate, setOnlyTime, onlyDate, onlyTime } = useDateTimeField({ value, onChange })

  return (
    <>
      <label className="px-2 text-sm text-gray-200">{label}</label>
      <div className='p-2 mx-2 mt-2 mb-4 bg-white rounded-lg w-50'>
        <input type="hidden" name={id} value={value} />
        <input
          className="outline-none w-28"
          onChange={(e) => setOnlyDate(e.target.value)}
          value={onlyDate}
          type='date'
        />
        <select className='ml-1 outline-none' value={onlyTime} onChange={(e) => setOnlyTime(e.target.value)}>
          { timeOptions.map((time) => (
            <option key={time} value={time}>{time}</option>
          )) }
        </select>
      </div>
    </>
  )
}
