import type { GoogleEventType } from './types'
import { makeApiCall } from '../google'
import { parseGoogleEvent } from './parse-event'
import type { EventType } from '@/types/event'

export type CreateUpdateEventProps = {
  calendarId: string,
  event: any,
  accessToken: string
}

export const createEvent = ({ calendarId, event, accessToken }: CreateUpdateEventProps):Promise<GoogleEventType> => {
  return makeApiCall({
    url: `/calendar/v3/calendars/${calendarId}/events`,
    accessToken,
    method: 'POST',
    data: event
  })
    .then(res => res.json())
    .then(res => {
      return res
    })
}

export type GetUpdateEventProps = {
  calendarId: string,
  eventId: EventType['id'],
  accessToken: string
}

export const getEvent = ({ calendarId, eventId, accessToken }: GetUpdateEventProps):Promise<EventType> => {
  return makeApiCall({
    url: `/calendar/v3/calendars/${calendarId}/events/${eventId}`,
    accessToken,
    method: 'GET'
  })
    .then(res => res.json())
    .then(parseGoogleEvent)
}

export type DeleteEventProps = {
  calendarId: string,
  eventId: string,
  accessToken: string
}

export const deleteEvent = ({ calendarId, eventId, accessToken }: DeleteEventProps):Promise<null> => {
  return makeApiCall({
    url: `/calendar/v3/calendars/${calendarId}/events/${eventId}`,
    accessToken,
    method: 'DELETE'
  })
    .then(() => null)
}

export const updateEvent = ({ calendarId, event, accessToken }: CreateUpdateEventProps):Promise<GoogleEventType> => {
  const { id, ...restOfEvent } = event
  return makeApiCall({
    url: `/calendar/v3/calendars/${calendarId}/events/${id}`,
    accessToken,
    method: 'PUT',
    data: restOfEvent
  })
    .then(res => res.json())
}
