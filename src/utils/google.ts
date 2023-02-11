import { CALENDAR_DEFAULT_TIMEZONE } from '@/services/google'
import { EventType } from '@/types/event'

export const generateEventObject = (data: EventType) => {
  const { fullName, date, duration } = data
  const startDate = new Date(date)
  const endDate = new Date(startDate)
  endDate.setMinutes(startDate.getMinutes() + duration)

  return {
    summary: `Cita para ${fullName}`,
    description: JSON.stringify(data),
    source: {
      title: 'MakeApp',
      url: 'https://makeapp.ar'
    },
    start: {
      dateTime: startDate.toISOString(),
      timeZone: CALENDAR_DEFAULT_TIMEZONE
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: CALENDAR_DEFAULT_TIMEZONE
    },
    reminders: {
      useDefault: false,
      overrides: [
        // { method: 'popup', minutes: 60 },
        { method: 'popup', minutes: 24 * 60 }
      ]
    }
  }
}
