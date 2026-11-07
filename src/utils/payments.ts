import type { PaymentType } from '@/types/payment'
import { PAYMENT_METHODS, SERVICES } from '@/types/payment'
import { APP_TIME_ZONE } from './datetime'

export const MAX_DESCRIPTION_LENGTH = 500

export const isValidPayment = (data: unknown): data is PaymentType => {
  if (typeof data !== 'object' || data === null) return false

  const { date, paymentMethod, description, service, amount, clientId } = data as PaymentType
  return typeof date === 'string' && !Number.isNaN(Date.parse(date)) &&
    PAYMENT_METHODS.includes(paymentMethod) &&
    typeof description === 'string' && description.length <= MAX_DESCRIPTION_LENGTH &&
    SERVICES.includes(service) &&
    Number(amount) > 0 &&
    (clientId === undefined || typeof clientId === 'string')
}

// This order is the column order of the ledger: changing it corrupts the sheet
export const getPaymentRow = ({ date, paymentMethod, description, service, amount, clientId }: PaymentType) => [
  new Date(date).toLocaleDateString('es-AR', { timeZone: APP_TIME_ZONE }),
  paymentMethod,
  description,
  service,
  amount,
  clientId ?? ''
]
