
export default function Text ({ placeholder, value, onChange, type = 'text' }) {
  return (
    <>
      <input
        className="m-2 p-2 focus:ring focus:ring-rose-400 outline-none rounded-lg"
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </>
  )
}
