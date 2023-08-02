// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { CALENDAR_NAME, getCalendar, listEvents } from '@/services/google'
import type { GoogleEventType } from '@/services/google/types'
import type { UserSession } from '@/types/session'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<GoogleEventType | any>
) {
  const { method } = req
  if (method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const session = await getServerSession(req, res, authOptions) as UserSession
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const { accessToken } = session

  const calendar = await getCalendar({ name: CALENDAR_NAME, accessToken: String(accessToken) })

  const events = await listEvents({ calendarId: calendar.id, accessToken: String(accessToken) })
  res.status(200).json(events)
}
