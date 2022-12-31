import { useId } from 'react'

type Props = {
  label: string,
  value: number,
  min?: number,
  max?: number,
  step?: number,
  onChange: (value: number) => void
}

export default function Slider (props: Props) {
  const { label, value, min = 0, max = 100, step = 1, onChange } = props
  const id = useId()
  return (
    <>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
      <input
        id={id}
        className="w-full h-3 bg-red-100 rounded-lg appearance-none cursor-pointer range-lg"
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        list={`ticks-${id}`}
      />
      <datalist className='flex justify-between mt-2' id={`ticks-${id}`}>
        {Array.from({ length: (max - min) / step + 1 }, (_, i) => (
          <option key={i} value={(i * step) + min} className="text-xs text-center text-gray-500 w-[20px]">{(i * step) + min}</option>
        ))}
      </datalist>
    </>
  )
}
