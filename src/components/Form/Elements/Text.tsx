type TextProps = {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'number' | 'textarea'
}

export default function Text ({ label, placeholder, value, onChange, type = 'text' }: TextProps) {
  if (type === 'textarea') {
    return (
      <>
        <label className="px-2 text-sm text-gray-200">{label}</label>
        <textarea
          className="h-24 p-2 mx-2 mt-2 mb-4 text-sm rounded-lg outline-none resize-none focus:ring focus:ring-gray-400"
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
        className="p-2 mx-2 mt-2 mb-4 rounded-lg outline-none focus:ring focus:ring-gray-400"
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? label}
        type={type}
        value={value}
      />
    </>
  )
}
