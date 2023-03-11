export const PAYMENT_METHODS = ['Efectivo', 'Cuenta DNI', 'Transferencia', 'Mercado Pago'] as const
export const SERVICES = ['Maquillaje', 'Curso', 'Cejas'] as const

export type PaymentType = {
  date: string
  paymentMethod: typeof PAYMENT_METHODS[number]
  description: string
  amount: number
  service: typeof SERVICES[number]
  clientId?: string
}
