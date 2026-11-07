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
import { getEventFormError } from './validation'

export type CreateEventState = { error: string } | null

export const createEventAction = async (_state: CreateEventState, formData: FormData): Promise<CreateEventState> => {
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    throw new Error('Unauthorized')
  }
  const { accessToken } = session

  const data = {
    fullName: String(formData.get('fullName') ?? '').trim(),
    date: String(formData.get('date') ?? ''),
    duration: Number(formData.get('duration')) as EventType['duration'],
    price: Number(formData.get('price')),
    deposit: Number(formData.get('deposit')),
    notes: String(formData.get('notes') ?? '')
  }

  const error = getEventFormError(data)
  if (error) {
    return { error }
  }

  try {
    const { id: calendarId } = await getCalendar({ name: CALENDAR_NAME, accessToken: String(accessToken) })
    const eventData = generateEventObject(data as EventType)
    await createEvent({ calendarId, event: eventData, accessToken: String(accessToken) })
  } catch (e) {
    console.error(e)
    return { error: 'No se pudo crear el turno. Intentá de nuevo.' }
  }

  await setNotification({ type: 'success', message: 'Evento creado correctamente' })
  redirect('/')
}
