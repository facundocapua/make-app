import { CALENDAR_NAME, getCalendar, GoogleApiError } from '@/services/google'
import { createEvent } from '@/services/google/events'
import { parseEventBody } from '@/utils/event-validation'
import { generateEventObject } from '@/utils/google'
import type { UserSession } from '@/types/session'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/utils/auth-options'

const handler = async (
  req: Request
) => {
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const { accessToken } = session

  const parsed = parseEventBody(await req.json().catch(() => null))
  if ('error' in parsed) {
    return NextResponse.json({ message: parsed.error }, { status: 400 })
  }

  try {
    const calendar = await getCalendar({ name: CALENDAR_NAME, accessToken: String(accessToken) })
    const eventData = generateEventObject(parsed.data)
    const event = await createEvent({ calendarId: calendar.id, event: eventData, accessToken: String(accessToken) })

    return NextResponse.json(event)
  } catch (error) {
    console.error(error)
    const status = error instanceof GoogleApiError ? error.status : 500
    return NextResponse.json({ message: 'Could not create event' }, { status })
  }
}

export { handler as POST }
