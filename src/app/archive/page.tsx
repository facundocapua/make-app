import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth-options'
import type { UserSession } from '@/types/session'
import { redirect } from 'next/navigation'
import { CALENDAR_NAME, getCalendar } from '@/services/google'
import { getFirstArchiveYear } from '@/utils/archive'
import { handlePageError } from '@/utils/page-errors'
import { getArchiveYear } from './get-archive-year'
import ArchiveList from './client'

export default async function ArchivePage () {
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    redirect('/api/auth/signin')
  }
  const accessToken = String(session.accessToken)

  try {
    const { id: calendarId } = await getCalendar({ name: CALENDAR_NAME, accessToken })
    const { events, nextBefore } = await getArchiveYear({ calendarId, accessToken, ...getFirstArchiveYear(new Date()) })

    return (<ArchiveList initialEvents={events} initialNextBefore={nextBefore} />)
  } catch (error) {
    handlePageError(error)
  }
}
