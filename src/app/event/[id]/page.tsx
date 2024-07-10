import { getServerSession } from 'next-auth'
import EventsPageClient from './client'
import { redirect } from 'next/navigation'
import { CALENDAR_NAME, getCalendar } from '@/services/google'
import { authOptions } from '@/utils/auth-options'
import type { UserSession } from '@/types/session'
import { getEvent } from '@/services/google/events'

type Props = {
  params: {
    id: string
  }
}

export default async function EventPage ({ params }: Props) {
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    redirect('/api/auth/signin')
  }
  const { accessToken } = session

  try {
    const calendar = await getCalendar({ name: CALENDAR_NAME, accessToken: String(accessToken) })
    const { id: calendarId } = calendar

    if (!calendar) {
      return (<div>No event</div>)
    }

    const { id } = params
    const event = await getEvent({ calendarId, eventId: id, accessToken: String(accessToken) })

    return (<EventsPageClient event={ event } />)
  } catch (error) {
    return (<div>No event</div>)
  }
}
