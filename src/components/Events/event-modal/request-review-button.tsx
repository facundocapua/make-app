import { ReviewIcon } from '@/components/Icons'
import type { EventType } from '@/types/event'

type Props = {
  event: EventType
}

export default function RequestReviewButton ({ event }: Props) {
  const { fullName } = event

  const handleShare = async () => {
    // const url = 'https://app.makeapp.ar/qr-reviews.png'
    // const res = await fetch(url)
    // const blob = await res.blob()

    const shareData = {
      // files: [
      //   new File([blob],
      //     'review.png',
      //     {
      //       type: blob.type,
      //       lastModified: new Date().getTime()
      //     }
      //   )
      // ],
      title: '¿Cómo te fue?',
      text: `Hola ${fullName}!
Espero que te haya gustado tu maquillaje!
Me encantaría recibir tus comentarios. 

Ingresá al link y compartí tu experiencia.
¡Gracias!
Fer Gutierrez Makeup

https://g.page/r/CVc4A9CcScYMEBM/review
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
