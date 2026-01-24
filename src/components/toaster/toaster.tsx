import { cookies } from 'next/headers'
import { Toaster } from 'sonner'
import FlashToasterClient from './toaster-client'
import { randomUUID } from 'crypto'

export async function FlashToaster() {
  const cookieStore = await cookies()
  const notification = cookieStore.get('notification')
  return (
    <>
      <Toaster />
      <FlashToasterClient notification={notification?.value} />
    </>
  )
}

export async function setNotification(notification: { type: 'success' | 'error'; message: string }) {
  const cookieStore = await cookies()
  cookieStore.set('notification', JSON.stringify({ ...notification, id: randomUUID() }), { path: '/', expires: new Date(Date.now() + 10 * 1000) })
}
