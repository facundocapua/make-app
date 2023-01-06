import { useRef, useState, RefObject, Dispatch, SetStateAction } from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
}

type Return = {
  editing: boolean
  inputRef: RefObject<HTMLInputElement>
  newValue: string
  setNewValue: Dispatch<SetStateAction<string>>
  handleShowInput: () => void
  handleConfirm: () => void
  handleCancel: () => void
}

export default function useEditInline ({ value, onChange }: Props): Return {
  const [editing, setEditing] = useState(false)
  const [newValue, setNewValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleShowInput = () => {
    setEditing(!editing)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const handleConfirm = () => {
    if (newValue !== value) onChange(newValue)

    setEditing(false)
  }

  const handleCancel = () => {
    setNewValue(value)
    setEditing(false)
  }

  return { editing, inputRef, newValue, setNewValue, handleShowInput, handleConfirm, handleCancel }
}
