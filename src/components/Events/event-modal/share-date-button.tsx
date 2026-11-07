import { ShareIcon } from '@/components/Icons'
import type { EventType } from '@/types/event'
import { formatDateShort, formatTime } from '@/utils/format'
import { getShareText, shareContent } from './share-utils'

type Props = {
  event: EventType
}

// The message is what matters, so it still goes out if the image can't be loaded
const getShareImage = async () => {
  try {
    const res = await fetch('/date-new.jpg')
    if (!res.ok) return null

    const blob = await res.blob()
    return new File([blob], 'turno.jpg', { type: blob.type, lastModified: Date.now() })
  } catch (err) {
    console.error(err)
    return null
  }
}

export default function ShareDateButton ({ event }: Props) {
  const { fullName, date, price, deposit } = event

  const handleShare = async () => {
    const day = formatDateShort(date)
    const time = formatTime(date)
    const balance = Math.round(price - deposit)
    const text = getShareText(fullName, day, time, balance, price)
    const image = await getShareImage()

    await shareContent({ ...(image && { files: [image] }), title: 'Tu turno', text })
  }

  return (
    <button onClick={handleShare}><ShareIcon className='w-6 h-6 text-gray-300 opacity-70 hover:opacity-100' /></button>
  )
}
