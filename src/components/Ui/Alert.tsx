import { AlertType } from '@/types/alerts'
import { useEffect } from 'react'
import { CloseIcon, InfoIcon } from '@/components/Icons'

type AlertProps = {
  type: AlertType,
  message: string,
  timeout?: number,
  onClose: () => void,
}

const AlertTypeColors = {
  [AlertType.SUCCESS]: 'green',
  [AlertType.WARNING]: 'yellow',
  [AlertType.ERROR]: 'red',
  [AlertType.INFO]: 'blue'
}

export default function Alert ({ type, message, onClose, timeout = 3000 }: AlertProps) {
  const color = AlertTypeColors[type]

  useEffect(() => {
    const timer = setTimeout(() => onClose(), timeout)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className={`w-full flex p-4 mb-4 rounded-lg  bg-${color}-100 drop-shadow-md`} role={type}>
      <InfoIcon className={`flex-shrink-0 w-5 h-5 text-${color}-700`} />
      <span className="sr-only">Info</span>
      <div className={`ml-3 text-sm font-medium text-${color}-700`}>
        {message}
      </div>
      <button onClick={onClose}
       type="button" className={`ml-auto -mx-1.5 -my-1.5rounded-lg focus:ring-2 inline-flex h-5 w-5 bg-${color}-100 text-${color}-500 focus:ring-${color}-400 hover:bg-${color}-200`} aria-label="Close">
        <span className="sr-only">Close</span>
        <CloseIcon className='w-5 h-5' />
      </button>
    </div>
  )
}
