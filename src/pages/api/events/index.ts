// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import type { EventType } from '@/types/event'
import { unstable_getServerSession as getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { CALENDAR_NAME, getCalendar } from '@/services/google'
import { createEvent } from '@/services/google/events'
import { GoogleEventType } from '@/services/google/types'
import { generateEventObject } from '@/utils/google'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<GoogleEventType | any>
) {
  const { method } = req
  if (method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const data:EventType = req.body
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const { accessToken } = session

  const calendar = await getCalendar({ name: CALENDAR_NAME, accessToken: String(accessToken) })

  const eventData = generateEventObject(data)
  const event = await createEvent({ calendarId: calendar.id, event: eventData, accessToken: String(accessToken) })

  res.status(200).json(event)
}
