import { AlertItemType, AlertType } from '@/types/alerts'
import * as React from 'react'

export type AddAlertProps = {
  type: AlertType,
  message: string,
}

export type AlertsContextType = {
  alerts: Array<AlertItemType>,
  addAlert: (alert: AddAlertProps) => void,
  removeAlert: (id: string) => void,
}

export const AlertsContext = React.createContext<AlertsContextType | null>(null)

export type AlertsProviderProps = {
  children: React.ReactNode,
}

const AlertProvider: React.FC<AlertsProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = React.useState<Array<AlertItemType>>([])

  const addAlert = (data: AddAlertProps) => {
    const alert = {
      id: Math.random().toString(),
      ...data
    }
    setAlerts([...alerts, alert])
  }

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id))
  }

  return (<AlertsContext.Provider value={{ alerts, addAlert, removeAlert }}>{children}</AlertsContext.Provider>)
}

export default AlertProvider
