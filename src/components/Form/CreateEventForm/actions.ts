'use server'

import { setNotification } from '@/components/toaster/toaster'
import { CALENDAR_NAME, getCalendar } from '@/services/google'
import { createEvent } from '@/services/google/events'
import type { EventType } from '@/types/event'
import type { UserSession } from '@/types/session'
import { authOptions } from '@/utils/auth-options'
import { generateEventObject } from '@/utils/google'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export const createEventAction = async (formData: FormData) => {
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    throw new Error('Unauthorized')
  }
  const { accessToken } = session

  const calendar = await getCalendar({ name: CALENDAR_NAME, accessToken: String(accessToken) })
  const { id: calendarId } = calendar

  const data: Partial<EventType> = {
    fullName: String(formData.get('fullName')) ?? '',
    date: String(formData.get('date')) ?? '',
    duration: Number(formData.get('duration')) as EventType['duration'],
    price: Number(formData.get('price')),
    deposit: Number(formData.get('deposit')),
    notes: String(formData.get('notes')) ?? ''
  }
  console.log('data', data)

  const eventData = generateEventObject(data as EventType)
  await createEvent({ calendarId, event: eventData, accessToken: String(accessToken) })
  setNotification({ type: 'success', message: 'Evento creado correctamente' })
  redirect('/')
}
