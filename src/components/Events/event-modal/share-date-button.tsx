import { ShareIcon } from '@/components/Icons'
import type { EventType } from '@/types/event'
import { formatDateShort, formatTime } from '@/utils/format'

type Props = {
  event: EventType
}

const getBalanceText = (balance: number, price: number) => {
  if (price === 0) return ''
  if (balance > 0) return `Te resta abonar 💰 *$${balance}*.`
  return 'Ya tienes el total abonado.'
}

export default function ShareDateButton ({ event }: Props) {
  const { fullName, date, price, deposit } = event

  const handleShare = async () => {
    const day = formatDateShort(date)
    const time = formatTime(date)
    const balance = Math.round(price - deposit)
    const url = 'https://app.makeapp.ar/date-new.jpg'

    const text = `Hola ${fullName}! 
Tu cita es el 🗓️ *${day}* a las 🕐 *${time}*. 
${getBalanceText(balance, price)}

Confirmar assistencia. 
Muchas gracias!
`

    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform.startsWith('Mac') && navigator.maxTouchPoints > 1)

    if (isIos) {
      const shareData = {
        title: 'Tu turno',
        text,
        url
      }
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log(err)
      }
      return
    }

    const res = await fetch(url)
    const blob = await res.blob()
    const shareData = {
      files: [
        new File([blob],
          'turno.jpg',
          {
            type: blob.type,
            lastModified: new Date().getTime()
          }
        )
      ],

      title: 'Tu turno',
      text
    }
    if (navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <button onClick={handleShare}><ShareIcon className='w-6 h-6 text-gray-300 opacity-70 hover:opacity-100' /></button>
  )
}
