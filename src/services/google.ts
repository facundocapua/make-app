import type { EventType } from '@/types/event'
import type { GoogleEventType } from './google/types'
import { parseGoogleEvent } from './google/parse-event'

export const CALENDAR_NAME: string = 'MakeApp Calendar'
export const CALENDAR_DEFAULT_TIMEZONE: string = 'America/Argentina/Buenos_Aires'

export type CalendarType = {
  id: string,
  summary: string,
  timeZone: string
}

const apiUrlsByService = {
  calendar: 'https://www.googleapis.com/',
  sheets: 'https://sheets.googleapis.com/'
}

type MakeApiCallProps = {
  url: string,
  accessToken: string,
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  service?: keyof typeof apiUrlsByService,
  data?: any,
}

export class GoogleApiError extends Error {
  status: number

  constructor (status: number, message: string) {
    super(message)
    this.name = 'GoogleApiError'
    this.status = status
  }
}

export const makeApiCall = async (props: MakeApiCallProps):Promise<Response> => {
  const { url, accessToken, method = 'GET', data, service = 'calendar' } = props
  const apiUrl = apiUrlsByService[service]

  const response = await fetch(`${apiUrl}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: data ? JSON.stringify(data) : undefined
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new GoogleApiError(response.status, body?.error?.message ?? response.statusText)
  }

  return response
}

export const getCalendarByName = (name: string, accessToken: string):Promise<CalendarType> => {
  return makeApiCall({
    url: '/calendar/v3/users/me/calendarList',
    accessToken
  })
    .then(res => res.json())
    .then(res => {
      return res.items.find((item: CalendarType) => item.summary === name)
    })
}

export const createCalendar = (name: string, accessToken: string):Promise<CalendarType> => {
  return makeApiCall({
    url: '/calendar/v3/calendars',
    accessToken,
    method: 'POST',
    data: {
      summary: name,
      timeZone: CALENDAR_DEFAULT_TIMEZONE
    }
  })
    .then(res => res.json())
}

type GetCalendarProps = {
  name: string,
  accessToken: string,
}

export const getCalendar = ({ name, accessToken }: GetCalendarProps):Promise<CalendarType> => {
  return getCalendarByName(name, accessToken)
    .then(calendar => {
      if (!calendar) {
        return createCalendar(name, accessToken)
      }

      return calendar
    })
}

export type GetEventsProps = {
  calendarId: string
  accessToken: string
  since?: Date
  to?: Date
}

type EventsPage = {
  items?: Array<GoogleEventType>,
  nextPageToken?: string
}

export const listEvents = async ({ calendarId, accessToken, since, to }: GetEventsProps):Promise<Array<EventType>> => {
  const params: {[key: string]: string} = {
    orderBy: 'startTime',
    singleEvents: 'true',
    maxResults: '2500',
    fields: 'nextPageToken,items(id,summary,description,start,end)'
  }

  if (since) {
    params.timeMin = since.toISOString()
  }

  if (to) {
    params.timeMax = to.toISOString()
  }

  const events: Array<EventType> = []
  let pageToken: string | undefined

  do {
    const query = new URLSearchParams(pageToken ? { ...params, pageToken } : params)
    const response = await makeApiCall({
      url: `/calendar/v3/calendars/${calendarId}/events?${query}`,
      accessToken
    })
    const page: EventsPage = await response.json()

    events.push(...(page.items ?? []).map(parseGoogleEvent))
    pageToken = page.nextPageToken
  } while (pageToken)

  return events
}
