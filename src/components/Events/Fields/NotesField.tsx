import { formatNotes } from '@/utils/format'
import { EditIcon } from '../../Icons'
import CancelIcon from '../../Icons/CancelIcon'
import CheckIcon from '../../Icons/CheckIcon'
import useEditInline from '../useEditInline'

type Props = {
  value: string
  onChange: (value: string) => void
}

export default function NotesField ({ value, onChange }: Props) {
  const { editing, newValue, inputRef, setNewValue, handleShowInput, handleCancel, handleConfirm } = useEditInline<HTMLTextAreaElement>({ value, onChange })

  if (!editing) {
    return (
      <div className="flex items-center w-full py-1 mb-2 text-sm md:w-5/6" onClick={handleShowInput}>
        <span className='w-2/3 whitespace-pre-line'>{formatNotes(value)}</span>
        <EditIcon className='w-4 h-4 ml-1 text-rose-700' />
      </div>
    )
  }

  return (
    <div className="flex items-center mb-2">
      <div className='relative w-full md:w-5/6' >
        <textarea
          className="w-2/3 p-2 text-sm rounded-lg outline-none resize-none focus:ring focus:ring-rose-400"
          onChange={(e) => setNewValue(e.target.value)}
          value={newValue}
          placeholder='Notas'
          ref={inputRef}

        >
        </textarea>
        <button className='absolute px-2 py-1 rounded right-12 bottom-1 bg-rose-400' onMouseDown={handleConfirm}>
          <CheckIcon className='w-6 h-6 text-rose-200' />
        </button>
        <button className='absolute px-2 py-1 rounded right-1 bottom-1 bg-rose-200' onClick={handleCancel}>
          <CancelIcon className='w-6 h-6 text-rose-400' />
        </button>
      </div>
    </div>
  )
}
