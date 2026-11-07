import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth-options'
import type { UserSession } from '@/types/session'
import { redirect } from 'next/navigation'
import type { GetEventsProps } from '@/services/google'
import { CALENDAR_NAME, getCalendar, listEvents } from '@/services/google'
import { startOfZonedDay } from '@/utils/datetime'
import { groupByDate } from '@/utils/events'
import EventsGroupList from '@/components/Events/events-group-list'
import { handlePageError } from '@/utils/page-errors'

export default async function ArchivePage () {
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    redirect('/api/auth/signin')
  }
  const { accessToken } = session

  try {
    const { id: calendarId } = await getCalendar({ name: CALENDAR_NAME, accessToken: String(accessToken) })

    const params: GetEventsProps = { calendarId, accessToken: String(accessToken) }

    const today = new Date()
    const since = startOfZonedDay(today)
    since.setUTCFullYear(since.getUTCFullYear() - 1)
    params.since = since
    params.to = today

    const events = await listEvents(params)
    events.reverse()
    const groupedEvents = groupByDate(events)

    return (<EventsGroupList data={groupedEvents} />)
  } catch (error) {
    handlePageError(error)
  }
}
