import { formatDisplayName } from '@/utils/format'
import { CheckIcon, EditIcon } from '../../Icons'
import useEditInline from '../useEditInline'

type Props = {
  name: string
  onChange: (name: string) => void
}

export default function DisplayNameInfo ({ name, onChange }: Props) {
  const { editing, newValue, inputRef, setNewValue, handleShowInput, handleCancel, handleConfirm } = useEditInline({ value: name, onChange })

  return (
    <div className="flex items-center justify-between">
      <div className='font-medium text-gray-300'>Nombre</div>
      {editing
        ? (
          <div className='flex items-center gap-2'>
            <input
              className="p-1 text-gray-100 bg-gray-500 rounded-lg outline-none w-[150px] focus:ring focus:ring-gray-400"
              onChange={(e) => setNewValue(e.target.value)}
              value={newValue}
              placeholder='Nombre'
              ref={inputRef}
              onBlur={handleCancel}
            />
            <button onMouseDown={handleConfirm}>
              <CheckIcon className='w-5 h-5 ml-1 text-gray-200' />
            </button>
          </div>
        )
        : (
          <div className='flex items-center gap-2 text-gray-200' onClick={handleShowInput}>
            <span className='p-1 w-[150px]'>{formatDisplayName(name)}</span>
            <EditIcon className='w-5 h-5 ml-1 text-gray-200' />
          </div>
        )}
    </div>
  )
}
