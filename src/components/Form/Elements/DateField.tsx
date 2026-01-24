import useDateTimeField from '@/components/Events/Fields/useDateTimeField'
import { CalendarIcon } from '@/components/Icons'

type Props = {
  label: string
  value: string
  onChange: (date: string) => void
}

export default function DateTimeField({ label, value, onChange }: Props) {
  const { setOnlyDate, onlyDate } = useDateTimeField({ value, onChange })

  return (
    <>
      <label className="px-2 text-sm text-gray-200">{label}</label>
      <div className='relative p-2 mx-2 mt-2 mb-4 bg-white rounded-lg w-auto'>
        <input
          className="outline-hidden w-28 "
          onChange={(e) => setOnlyDate(e.target.value)}
          value={onlyDate}
          type='date'
        />
        <CalendarIcon className='custom-calendar-icon absolute w-5 h-5 text-gray-600 top-[10px] left-[105px] pointer-events-none' />
      </div>
    </>
  )
}
