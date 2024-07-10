import { cookies } from 'next/headers'
import { Toaster } from 'sonner'
import FlashToasterClient from './toaster-client'

export function FlashToaster () {
  const notification = cookies().get('notification')
  return (
    <>
      <Toaster />
      <FlashToasterClient notification={notification?.value} />
    </>
  )
}

export function setNotification (notification: { type: 'success' | 'error'; message: string }) {
  cookies().set('notification', JSON.stringify(notification), { path: '/', expires: new Date(Date.now() + 10 * 1000) })
}
