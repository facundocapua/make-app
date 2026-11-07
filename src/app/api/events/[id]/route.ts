import type { EventType } from '@/types/event'
import { CALENDAR_NAME, getCalendar, GoogleApiError } from '@/services/google'
import { deleteEvent, getEvent, updateEvent } from '@/services/google/events'
import { parseEventBody } from '@/utils/event-validation'
import { generateEventObject } from '@/utils/google'
import type { UserSession } from '@/types/session'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/utils/auth-options'

const handler = async (
  req: Request,
  { params }: { params: Promise<{id: EventType['id']}> }
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

  const { id } = await params

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
      const parsed = parseEventBody(await req.json().catch(() => null))
      if ('error' in parsed) {
        return NextResponse.json({ message: parsed.error }, { status: 400 })
      }

      // The picture is only managed by its own actions, so it stays as stored
      const current = await getEvent({ calendarId, eventId: id, accessToken: String(accessToken) })
      const eventData = generateEventObject({ ...current, ...parsed.data })
      await updateEvent({ calendarId, event: { id, ...eventData }, accessToken: String(accessToken) })
      return NextResponse.json({ message: 'Event updated' })
    } catch (e: any) {
      return NextResponse.json({ message: e.message }, { status: e instanceof GoogleApiError ? e.status : 500 })
    }
  }
}

export { handler as PUT, handler as DELETE }
