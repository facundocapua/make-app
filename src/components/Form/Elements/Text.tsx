
type TextProps = {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type?: string
}

export default function Text ({ label, placeholder, value, onChange, type = 'text' }: TextProps) {
  return (
    <>
      <label className="px-2 text-sm">{label}</label>
      <input
        className="p-2 mx-2 mt-2 mb-4 rounded-lg outline-none focus:ring focus:ring-rose-400"
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? label}
        type={type}
        value={value}
      />
    </>
  )
}
