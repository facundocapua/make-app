import { toast } from 'sonner'
import { formatPrice } from '@/utils/format'

// Not every browser can share, so the text is copied instead of the button doing nothing
export const shareContent = async (shareData: { title: string, text: string, files?: File[] }) => {
  if (navigator.canShare?.(shareData)) {
    try {
      await navigator.share(shareData)
      return
    } catch (err) {
      // The user closed the share sheet
      if (err instanceof Error && err.name === 'AbortError') return
      console.error(err)
    }
  }

  try {
    await navigator.clipboard.writeText(shareData.text)
    toast.success('Mensaje copiado. Pegalo donde quieras enviarlo.', { position: 'top-center' })
  } catch (err) {
    console.error(err)
    toast.error('No se pudo compartir el mensaje', { position: 'top-center' })
  }
}

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
