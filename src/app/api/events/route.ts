import type { NextApiRequest, NextApiResponse } from 'next'
import type { EventType } from '@/types/event'
import { CALENDAR_NAME, getCalendar } from '@/services/google'
import { createEvent } from '@/services/google/events'
import type { GoogleEventType } from '@/services/google/types'
import { generateEventObject } from '@/utils/google'
import type { UserSession } from '@/types/session'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

const handler = async (
  req: Request
) => {
  const data:EventType = await req.json()

  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const { accessToken } = session

  const calendar = await getCalendar({ name: CALENDAR_NAME, accessToken: String(accessToken) })

  const eventData = generateEventObject(data)
  const event = await createEvent({ calendarId: calendar.id, event: eventData, accessToken: String(accessToken) })

  return NextResponse.json(event)
}

export { handler as POST }
