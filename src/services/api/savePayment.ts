import type { PaymentType } from '@/types/payment'

export const savePayment = (payment: PaymentType): Promise<PaymentType> => {
  return fetch('/api/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payment)
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }

      return res.json()
    })
}
