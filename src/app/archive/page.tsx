import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth-options'
import type { UserSession } from '@/types/session'
import { redirect } from 'next/navigation'
import type { GetEventsProps } from '@/services/google'
import { CALENDAR_NAME, getCalendar, listEvents } from '@/services/google'
import { groupByDate } from '@/utils/events'
import EventsGroupList from '@/components/Events/events-group-list'

export default async function ArchivePage () {
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    redirect('/api/auth/signin')
  }
  const { accessToken } = session

  try {
    const calendar = await getCalendar({ name: CALENDAR_NAME, accessToken: String(accessToken) })
    const calendarId = calendar.id
    if (calendarId === '' || accessToken === '') {
      return (<div>No events</div>)
    }

    const params: GetEventsProps = { calendarId, accessToken: String(accessToken) }

    const today = new Date()
    params.since = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
    params.to = today

    const events = await listEvents(params)
    events.reverse()
    const groupedEvents = groupByDate(events)

    return (<EventsGroupList data={groupedEvents} />)
  } catch (error) {
    return (<div>No events</div>)
  }
}
