import { APP_TIME_ZONE, getZonedDay } from './datetime'

const ROUND_TIME_MS = 15 * 60 * 1000

export const formatDisplayName = (name: string): string => {
  if (String(name) === '') return 'Anónimo'

  return name
}

export const formatPrice = (price: number) => {
  const arsFormat = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  })

  return arsFormat.format(price)
}

export const formatDateComputer = (date: string) => getZonedDay(new Date(date))

export const formatDate = (date: string) => {
  const dateObj = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    timeZone: APP_TIME_ZONE,
    day: '2-digit',
    month: 'short',
    weekday: 'long',
    year: 'numeric'
  }

  return dateObj.toLocaleDateString('es-AR', options)
}

export const formatDateShort = (date: string) => {
  const dateObj = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    timeZone: APP_TIME_ZONE,
    day: '2-digit',
    month: '2-digit'
  }

  return dateObj.toLocaleDateString('es-AR', options)
}

export const formatDateTime = (date: string) => {
  const dateObj = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    timeZone: APP_TIME_ZONE,
    day: 'numeric',
    month: 'short',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }

  return dateObj.toLocaleDateString('es-AR', options)
}

export const formatTime = (date:string, round: boolean = true): string => {
  const time = new Date(date).getTime()
  const dateObj = new Date(round ? Math.round(time / ROUND_TIME_MS) * ROUND_TIME_MS : time)
  const options: Intl.DateTimeFormatOptions = {
    timeZone: APP_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }
  return dateObj.toLocaleString('es-AR', options)
}

export const formatNotes = (notes: string) => {
  if (notes === '') return 'Sin notas'

  return notes
}
