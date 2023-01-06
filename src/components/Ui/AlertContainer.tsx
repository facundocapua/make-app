
import { useContext } from 'react'
import { AlertsContext, AlertsContextType } from '@/context/alerts'
import Alert from './Alert'

export default function AlertContainer () {
  const { alerts, removeAlert } = useContext(AlertsContext) as AlertsContextType

  if (!alerts.length) return null

  return (
    <div className='fixed flex flex-col items-center justify-center w-full'>
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
