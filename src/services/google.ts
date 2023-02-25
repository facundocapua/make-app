import type { EventType } from '@/types/event'
import type { GoogleEventType } from './google/types'
export const CALENDAR_NAME: string = 'MakeApp Calendar'
export const CALENDAR_DEFAULT_TIMEZONE: string = 'America/Argentina/Buenos_Aires'

export type CalendarType = {
  id: string,
  summary: string,
  timeZone: string
}

type MakeApiCallProps = {
  url: string,
  accessToken: string,
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: any,
}

export const makeApiCall = (props: MakeApiCallProps):Promise<Response> => {
  const { url, accessToken, method = 'GET', data } = props

  return fetch(`https://www.googleapis.com${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: data ? JSON.stringify(data) : undefined
  }
  )
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
}

export const listEvents = ({ calendarId, accessToken, since }: GetEventsProps):Promise<Array<EventType>> => {
  const params: {[key: string]: string} = {
    orderBy: 'startTime',
    singleEvents: 'true'
  }

  if (since) {
    params.timeMin = since.toISOString()
  }

  return makeApiCall({
    url: `/calendar/v3/calendars/${calendarId}/events?${new URLSearchParams(params)}`,
    accessToken
  })
    .then(res => res.json())
    .then(res => {
      return res.items.map((item: GoogleEventType): EventType => {
        const { id, description } = item
        const data = JSON.parse(description)
        return {
          id,
          ...data
        }
      })
    })
}
