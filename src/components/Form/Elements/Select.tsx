type Props<T = string> = {
  id: string
  label: string
  value: T
  options: string[] | readonly string[]
  onChange: (value: T) => void
}

export default function Text({ id, label, options, value, onChange }: Props) {
  return (
    <>
      <label className="px-2 text-sm text-gray-200">{label}</label>
      <select id={id} name={id} className='p-2 mx-2 mt-2 mb-4 rounded-lg outline-hidden focus:ring-3 focus:ring-gray-400 bg-white' value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </>
  )
}
