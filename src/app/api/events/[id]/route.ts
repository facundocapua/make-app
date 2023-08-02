import type { EventType } from '@/types/event'
import { CALENDAR_NAME, getCalendar } from '@/services/google'
import { deleteEvent, updateEvent } from '@/services/google/events'
import { generateEventObject } from '@/utils/google'
import type { UserSession } from '@/types/session'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '../../auth/[...nextauth]/route'

const handler = async (
  req: Request,
  { params }: { params: {id: EventType['id']} }
) => {
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const { accessToken } = session

  const calendar = await getCalendar({ name: CALENDAR_NAME, accessToken: String(accessToken) })
  const { id: calendarId } = calendar

  if (!calendar) {
    return NextResponse.json({ message: 'Calendar not found' }, { status: 404 })
  }

  const { id } = params

  const { method } = req
  if (method === 'DELETE') {
    try {
      await deleteEvent({ calendarId, eventId: id, accessToken: String(accessToken) })
      return NextResponse.json({ message: 'Event deleted' })
    } catch (e: any) {
      return NextResponse.json({ message: e.message }, { status: 400 })
    }
  }

  if (method === 'PUT') {
    try {
      const data:EventType = await req.json()
      const eventData = generateEventObject(data)
      await updateEvent({ calendarId, event: { id, ...eventData }, accessToken: String(accessToken) })
      return NextResponse.json({ message: 'Event updated' })
    } catch (e: any) {
      return NextResponse.json({ message: e.message }, { status: 400 })
    }
  }
}

export { handler as PUT, handler as DELETE }
