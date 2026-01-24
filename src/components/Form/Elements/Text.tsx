type TextProps = {
  id: string
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'number' | 'textarea'
}

export default function Text({ id, label, placeholder, value, onChange, type = 'text' }: TextProps) {
  if (type === 'textarea') {
    return (
      <>
        <label className="px-2 text-sm text-gray-200">{label}</label>
        <textarea
          id={id}
          name={id}
          className="h-24 p-2 mx-2 mt-2 mb-4 text-sm rounded-lg outline-hidden resize-none focus:ring-3 focus:ring-gray-400 bg-white"
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? label}
          defaultValue={value}
        >
        </textarea>
      </>
    )
  }

  return (
    <>
      <label className="px-2 text-sm text-gray-200">{label}</label>
      <input
        id={id}
        name={id}
        className="p-2 mx-2 mt-2 mb-4 rounded-lg outline-hidden focus:ring-3 focus:ring-gray-400 bg-white"
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? label}
        type={type}
        value={value}
      />
    </>
  )
}
