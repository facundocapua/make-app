import { PaperAirplaneIcon, ShareIcon } from '@/components/Icons'
import type { EventType } from '@/types/event'
import { formatDateShort, formatTime } from '@/utils/format'
import { getBalanceText, getShareText } from './share-utils'

type Props = {
  event: EventType
}
export default function ShareMessageButton ({ event }: Props) {
  const { fullName, date, price, deposit } = event

  const handleShare = async () => {
    const day = formatDateShort(date)
    const time = formatTime(date)
    const balance = Math.round(price - deposit)
    
    const text = getShareText(fullName, day, time, balance, price)
    const shareData = {
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
    <button onClick={handleShare}><PaperAirplaneIcon className='w-6 h-6 text-gray-300 opacity-70 hover:opacity-100' /></button>
  )
}
