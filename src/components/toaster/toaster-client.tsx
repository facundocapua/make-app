'use client'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function FlashToasterClient (props: { notification: string | undefined }) {
  useEffect(() => {
    if (props.notification) {
      const { type, message } = JSON.parse(props.notification)
      if (type === 'success') {
        toast.success(message, { position: 'top-center' })
      } else if (type === 'error') {
        toast.error(message, { position: 'top-center' })
      }
    }
  }, [props.notification])
  return null
}
