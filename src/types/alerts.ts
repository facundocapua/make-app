export enum AlertType{
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
}

export type AlertItemType = {
  id: string
  type: AlertType
  message: string
  timeoutToDisappear?: ReturnType<typeof setTimeout>
}
