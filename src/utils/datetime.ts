// Appointments always happen in Argentina, whatever the timezone of the server or the browser
export const APP_TIME_ZONE = 'America/Argentina/Buenos_Aires'

const zonedPartsFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: APP_TIME_ZONE,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
})

const getZonedParts = (date: Date) => {
  const parts = zonedPartsFormat.formatToParts(date)
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]))
}

const getOffsetMs = (date: Date) => {
  const { year, month, day, hour, minute, second } = getZonedParts(date)
  const zonedAsUtc = Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second))
  return zonedAsUtc - Math.floor(date.getTime() / 1000) * 1000
}

// Returns the instant of a wall clock time in the app timezone, such as ('2026-05-01', '10:30')
export const zonedDateTime = (day: string, time: string): Date => {
  const guess = new Date(`${day}T${time}Z`)
  if (Number.isNaN(guess.getTime())) return guess

  // The second pass gets the right offset when the first guess falls on the other side of a DST change
  const firstPass = new Date(guess.getTime() - getOffsetMs(guess))
  return new Date(guess.getTime() - getOffsetMs(firstPass))
}

// Returns the calendar day (YYYY-MM-DD) of an instant in the app timezone, or '' for an invalid date
export const getZonedDay = (date: Date): string => {
  if (Number.isNaN(date.getTime())) return ''

  const { year, month, day } = getZonedParts(date)
  return [year, month, day].join('-')
}

export const startOfZonedDay = (date: Date): Date => zonedDateTime(getZonedDay(date), '00:00')

export const minutesOptions = ['00', '15', '30', '45']
export const hoursOptions = Array(24).fill(0).map((_, i) => String(i).padStart(2, '0'))
export const timeOptions = hoursOptions.map(h => minutesOptions.map(m => (`${h}:${m}`))).flat()

export const durationOptions = ['30', '45', '60', '90', '120']
