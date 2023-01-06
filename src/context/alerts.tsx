import { AlertItemType, AlertType } from '@/types/alerts'
import { createContext, ReactNode, useRef, useState, FC } from 'react'

const DURATION = 3000

export type AddAlertProps = {
  type: AlertType,
  message: string
}

export type AlertsContextType = {
  alerts: Array<AlertItemType>,
  addAlert: (alert: AddAlertProps) => void,
  removeAlert: (id: string) => void,
}

export const AlertsContext = createContext<AlertsContextType | null>(null)

export type AlertsProviderProps = {
  children: ReactNode,
}

const AlertProvider: FC<AlertsProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<Array<AlertItemType>>([])
  const alertsRef = useRef(alerts)

  const addAlert = (data: AddAlertProps) => {
    const alert = {
      id: Math.random().toString(),
      ...data
    } as AlertItemType

    alert.timeoutToDisappear = setTimeout(() => {
      removeAlert(alert.id)
    }, DURATION)

    alertsRef.current = [...alertsRef.current, alert]
    setAlerts(alertsRef.current)
  }

  const removeAlert = (id: string) => {
    const alertToRemove = alertsRef.current.find(alert => alert.id === id)
    if (!alertToRemove) return null
    clearTimeout(alertToRemove.timeoutToDisappear)

    alertsRef.current = alertsRef.current.filter(alert => alert.id !== id)
    setAlerts(alertsRef.current)
  }

  return (<AlertsContext.Provider value={{ alerts, addAlert, removeAlert }}>{children}</AlertsContext.Provider>)
}

export default AlertProvider
