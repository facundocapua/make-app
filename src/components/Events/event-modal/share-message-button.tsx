import { PaperAirplaneIcon } from '@/components/Icons'
import type { EventType } from '@/types/event'
import { formatDateShort, formatTime } from '@/utils/format'
import { getShareText, shareContent } from './share-utils'

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
    await shareContent({ title: 'Tu turno', text })
  }

  return (
    <button onClick={handleShare}><PaperAirplaneIcon className='w-6 h-6 text-gray-300 opacity-70 hover:opacity-100' /></button>
  )
}
