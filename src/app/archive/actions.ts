'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth-options'
import type { UserSession } from '@/types/session'
import { CALENDAR_NAME, getCalendar } from '@/services/google'
import { getYearBefore } from '@/utils/archive'
import type { ArchiveYear } from './get-archive-year'
import { getArchiveYear } from './get-archive-year'

// Loads the year that ends at `before`, which comes from the previous page
export const loadArchiveYearAction = async (before: string): Promise<ArchiveYear> => {
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    throw new Error('Unauthorized')
  }

  const to = new Date(before)
  if (Number.isNaN(to.getTime())) {
    throw new Error('Invalid date')
  }

  const accessToken = String(session.accessToken)
  const { id: calendarId } = await getCalendar({ name: CALENDAR_NAME, accessToken })
  return getArchiveYear({ calendarId, accessToken, since: getYearBefore(to), to })
}
