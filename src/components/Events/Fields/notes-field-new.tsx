import { formatNotes } from '@/utils/format'
import { EditIcon } from '../../Icons'
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
      <>
        <div>
          <div className='font-medium text-gray-300' onClick={handleShowInput}>Notas</div>
          <div className='flex items-start justify-between' onClick={handleShowInput}>
            <span className='w-2/3 whitespace-pre-line text-gray-200 text-sm'>{formatNotes(value)}</span>
            <EditIcon className='w-5 h-5 ml-1 text-gray-200' />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div>
        <div className='font-medium text-gray-300' onClick={handleCancel}>Notas</div>
        <div className='flex items-start justify-between'>
          <textarea
            className="w-[300px] p-1 text-sm text-gray-100 bg-gray-500 rounded-lg outline-hidden resize-none focus:ring-3 focus:ring-gray-400"
            onChange={(e) => setNewValue(e.target.value)}
            value={newValue}
            placeholder='Notas'
            ref={inputRef}
            onBlur={handleCancel}
          >
          </textarea>
          <button onMouseDown={handleConfirm}>
            <CheckIcon className='w-5 h-5 ml-1 text-gray-200' />
          </button>
        </div>
      </div>
    </>
  )
}
