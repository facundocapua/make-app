// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CALENDAR_NAME, getCalendar, listEvents } from '@/services/google'
import type { UserSession } from '@/types/session'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

const handler = async () => {
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const { accessToken } = session

  const calendar = await getCalendar({ name: CALENDAR_NAME, accessToken: String(accessToken) })

  const events = await listEvents({ calendarId: calendar.id, accessToken: String(accessToken) })
  return NextResponse.json(events)
}

export { handler as GET }
