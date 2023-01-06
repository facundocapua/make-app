import { formatDisplayName } from '@/utils/format'
import { EditIcon } from '../../Icons'
import CancelIcon from '../../Icons/CancelIcon'
import CheckIcon from '../../Icons/CheckIcon'
import useEditInline from '../useEditInline'

type Props = {
  name: string
  onChange: (name: string) => void
}

export default function DisplayNameInfo ({ name, onChange }: Props) {
  const { editing, newValue, inputRef, setNewValue, handleShowInput, handleCancel, handleConfirm } = useEditInline({ value: name, onChange })

  if (!editing) {
    return (
      <h1 className="flex items-center py-1 mb-2 text-2xl font-bold" onClick={handleShowInput}>
        {formatDisplayName(name)}
        <EditIcon className='w-4 h-4 ml-1 text-rose-700' />
      </h1>
    )
  }

  return (
    <div className="flex items-center mb-2">
      <div className='relative'>
        <input
          className="p-2 rounded-lg outline-none focus:ring focus:ring-rose-400"
          onChange={(e) => setNewValue(e.target.value)}
          value={newValue}
          placeholder='Nombre'
          ref={inputRef}
          onBlur={handleCancel}
        />
        <button className='absolute px-2 py-1 rounded right-12 bottom-1 bg-rose-400' onClick={handleConfirm}>
          <CheckIcon className='w-6 h-6 text-rose-200' />
        </button>
        <button className='absolute px-2 py-1 rounded right-1 bottom-1 bg-rose-200' onClick={handleCancel}>
          <CancelIcon className='w-6 h-6 text-rose-400' />
        </button>
      </div>
    </div>
  )
}
