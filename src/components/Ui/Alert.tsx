import { CloseIcon, InfoIcon } from '@/components/Icons'
import { AlertType } from '@/types/alerts'

type AlertProps = {
  type: AlertType,
  message: string,
  timeout?: number,
  onClose: () => void,
}

const AlertTypeStyles = {
  [AlertType.SUCCESS]: {
    background: 'bg-green-100',
    hoverBackground: 'bg-green-200',
    text: 'text-green-700',
    textLight: 'text-green-500',
    ring: 'ring-green-400'
  },
  [AlertType.WARNING]: {
    background: 'bg-yellow-100',
    hoverBackground: 'bg-yellow-200',
    text: 'text-yellow-700',
    textLight: 'text-yellow-500',
    ring: 'ring-yellow-400'
  },
  [AlertType.ERROR]: {
    background: 'bg-red-100',
    hoverBackground: 'bg-red-200',
    text: 'text-red-700',
    textLight: 'text-red-500',
    ring: 'ring-red-400'
  },
  [AlertType.INFO]: {
    background: 'bg-blue-100',
    hoverBackground: 'bg-blue-200',
    text: 'text-blue-700',
    textLight: 'text-blue-500',
    ring: 'ring-blue-400'
  }
}

export default function Alert ({ type, message, onClose }: AlertProps) {
  const styles = AlertTypeStyles[type]

  return (
    <div className={`w-5/6 flex p-4 mb-4 rounded-lg ${styles.background} drop-shadow-md`} role={type}>
      <InfoIcon className={`flex-shrink-0 w-5 h-5 ${styles.text}`} />
      <span className="sr-only">Info</span>
      <div className={`ml-3 text-sm font-medium ${styles.text}`}>
        {message}
      </div>
      <button onClick={onClose}
        type="button" className={`ml-auto -mx-1.5 -my-1.5rounded-lg focus:ring-2 inline-flex h-5 w-5 ${styles.background} ${styles.textLight} focus:${styles.ring} hover:${styles.hoverBackground}`} aria-label="Close">
        <span className="sr-only">Close</span>
        <CloseIcon className='w-5 h-5' />
      </button>
    </div>
  )
}
