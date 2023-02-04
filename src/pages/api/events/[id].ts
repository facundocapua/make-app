// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import type { EventType } from '@/types/event'
import { unstable_getServerSession as getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { CALENDAR_NAME, getCalendar } from '@/services/google'
import { deleteEvent, updateEvent } from '@/services/google/events'
import { generateEventObject } from '@/utils/google'
import { UserSession } from '@/types/session'

type Response = {
  message: string
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const session = await getServerSession(req, res, authOptions) as UserSession
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const { accessToken } = session
  const calendar = await getCalendar({ name: CALENDAR_NAME, accessToken: String(accessToken) })
  const { id: calendarId } = calendar

  if (!calendar) {
    return res.status(404).json({ message: 'Calendar not found' })
  }

  const { id } = req.query as {id: EventType['id']}

  const { method } = req
  if (method === 'DELETE') {
    try {
      await deleteEvent({ calendarId, eventId: id, accessToken: String(accessToken) })
      return res.status(200).json({ message: 'Event deleted' })
    } catch (e: any) {
      return res.status(400).json({ message: e.message })
    }
  }

  if (method === 'PUT') {
    try {
      const data:EventType = req.body
      const eventData = generateEventObject(data)
      await updateEvent({ calendarId, event: { id, ...eventData }, accessToken: String(accessToken) })
      return res.status(200).json({ message: 'Event updated' })
    } catch (e: any) {
      return res.status(400).json({ message: e.message })
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' })
}
