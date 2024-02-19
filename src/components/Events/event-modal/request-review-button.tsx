import { ReviewIcon } from '@/components/Icons'
import type { EventType } from '@/types/event'

type Props = {
  event: EventType
}

export default function RequestReviewButton ({ event }: Props) {
  const { fullName } = event

  const handleShare = async () => {
    const shareData = {
      title: '¿Cómo te fue?',
      text: `Hola ${fullName}!
Espero haber cumplido con tus expectativas y que hayas brillado en el evento.
Me encantaría recibir tus comentarios. 

Ingresá al link y compartí tu experiencia.
¡Gracias!
Fer Gutierrez Makeup

https://g.page/r/CVc4A9CcScYMEAI/review
`
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
    <button onClick={handleShare}><ReviewIcon className='w-6 h-6 text-gray-300 opacity-70 hover:opacity-100' /></button>
  )
}
