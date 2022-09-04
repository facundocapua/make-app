
import { useContext } from 'react'
import { AlertsContext, AlertsContextType } from '@/context/alerts'
import Alert from './Alert'

export default function AlertContainer () {
  const { alerts, removeAlert } = useContext(AlertsContext) as AlertsContextType

  if (!alerts.length) return null

  return (
    <div className='fixed w-full max-w-sm flex flex-col justify-center items-center'>
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          {...alert}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  )
}
