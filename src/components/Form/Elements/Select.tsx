
type Props<T = string> = {
  label: string
  value: T
  options: string[]
  onChange: (value: T) => void
}

export default function Text ({ label, options, value, onChange }: Props) {
  return (
    <>
      <label className="px-2 text-sm">{label}</label>
      <select className='p-2 mx-2 mt-2 mb-4 rounded-lg outline-none focus:ring focus:ring-rose-400' value={value} onChange={(e) => onChange(e.target.value)}>
        { options.map((option) => (
          <option key={option} value={option}>{option}</option>
        )) }
      </select>
    </>
  )
}
