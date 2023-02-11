import { useRef, useState, RefObject, Dispatch, SetStateAction } from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
}

type Return<T = HTMLInputElement> = {
  editing: boolean
  inputRef: RefObject<T>
  newValue: string
  setNewValue: Dispatch<SetStateAction<string>>
  handleShowInput: () => void
  handleConfirm: () => void
  handleCancel: () => void
}

export default function useEditInline<T=HTMLInputElement> ({ value, onChange }: Props): Return<T> {
  const [editing, setEditing] = useState(false)
  const [newValue, setNewValue] = useState(value)
  const inputRef = useRef<T>(null)

  const handleShowInput = () => {
    setEditing(!editing)
    setTimeout(() => {
      const input = inputRef.current as HTMLInputElement | HTMLTextAreaElement
      input?.focus()
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
