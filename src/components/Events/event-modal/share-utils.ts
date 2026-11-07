import { formatPrice } from '@/utils/format'

export const getBalanceText = (balance: number, price: number) => {
  if (price === 0) return ''
  if (balance > 0) return `Te resta abonar 💰 *${formatPrice(balance)}*.`
  return 'Ya tenés el total abonado.'
}

export const getShareText = (fullName: string, day: string, time: string, balance: number, price: number) => {
  return `Hola ${fullName}! 
Tu cita es el 🗓️ *${day}* a las 🕐 *${time}*. 
${getBalanceText(balance, price)}

Por favor, confirmá tu asistencia.
Muchas gracias!
`
}
