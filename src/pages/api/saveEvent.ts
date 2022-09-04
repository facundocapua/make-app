// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { CALENDAR_NAME, CALENDAR_DEFAULT_TIMEZONE, getCalendar, createEvent } from '@/services/google'

type EventData = {
  fullName: string,
  date: string
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<EventData>
) {
  const data:EventData = req.body
  const session = await unstable_getServerSession(req, res, authOptions)
  const { accessToken } = session
  const calendar = await getCalendar({ name: CALENDAR_NAME, accessToken })

  const startDate = new Date(data.date)
  const endDate = new Date(startDate)
  endDate.setHours(startDate.getHours() + 1)

  const eventData = {
    summary: `Maquillaje para ${data.fullName}`,
    description: JSON.stringify(data),
    source: {
      title: 'MakeApp',
      url: 'https://makeapp.ar'
    },
    start: {
      dateTime: startDate.toISOString(),
      timeZone: CALENDAR_DEFAULT_TIMEZONE
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: CALENDAR_DEFAULT_TIMEZONE
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 60 },
        { method: 'email', minutes: 24 * 60 }
      ]
    }
  }

  const event = await createEvent({ calendarId: calendar.id, event: eventData, accessToken })

  res.status(200).json(event)
}
