import type { EventType } from '@/types/event'
import { durationOptions } from '@/utils/datetime'

export const MAX_NAME_LENGTH = 120
export const MAX_NOTES_LENGTH = 2000

const EDITABLE_EVENT_FIELDS = ['fullName', 'date', 'price', 'deposit', 'notes'] as const

export type EventChanges = Partial<Pick<EventType, typeof EDITABLE_EVENT_FIELDS[number]>>

// The checks take unknown values because server actions and API routes receive whatever the client sends
const getNameError = (fullName: unknown) => {
  if (typeof fullName !== 'string' || !fullName.trim()) return 'Ingresá un nombre'
  if (fullName.length > MAX_NAME_LENGTH) return 'El nombre es demasiado largo'

  return null
}

const getDateError = (date: unknown) => {
  return typeof date === 'string' && !Number.isNaN(Date.parse(date)) ? null : 'Ingresá una fecha válida'
}

const getDurationError = (duration: unknown) => {
  return durationOptions.includes(String(duration)) ? null : 'Elegí una duración válida'
}

const getAmountsError = (price: unknown, deposit: unknown) => {
  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) return 'El precio no puede ser negativo'
  if (typeof deposit !== 'number' || !Number.isFinite(deposit) || deposit < 0) return 'La seña no puede ser negativa'
  if (deposit > price) return 'La seña no puede superar el precio'

  return null
}

const getNotesError = (notes: unknown) => {
  if (notes === undefined) return null
  if (typeof notes !== 'string') return 'Las notas no son válidas'

  return notes.length > MAX_NOTES_LENGTH ? 'Las notas son demasiado largas' : null
}

type EventFormData = Pick<EventType, 'fullName' | 'date' | 'duration' | 'price' | 'deposit' | 'notes'>

export const getEventFormError = ({ fullName, date, duration, price, deposit, notes }: EventFormData) => {
  return getNameError(fullName) ??
    getDateError(date) ??
    getDurationError(duration) ??
    getAmountsError(price, deposit) ??
    getNotesError(notes)
}

// Drops any field the client isn't allowed to edit, such as picture or id
export const pickEventChanges = (changes: EventChanges): EventChanges => {
  const editable = EDITABLE_EVENT_FIELDS.filter(field => Object.hasOwn(changes, field))
  return Object.fromEntries(editable.map(field => [field, changes[field]]))
}

// Only checks what changes: events added by hand in Google Calendar may not pass a full validation
export const getEventChangesError = (changes: EventChanges, current: EventType) => {
  if ('fullName' in changes) {
    const error = getNameError(changes.fullName)
    if (error) return error
  }
  if ('date' in changes) {
    const error = getDateError(changes.date)
    if (error) return error
  }
  if ('price' in changes || 'deposit' in changes) {
    const { price, deposit } = { ...current, ...changes }
    const error = getAmountsError(price, deposit)
    if (error) return error
  }
  if ('notes' in changes) {
    return getNotesError(changes.notes)
  }

  return null
}

type ParsedEventBody = { error: string } | { data: Omit<EventType, 'id' | 'picture'> }

// Validates a whole event sent to the API and keeps only its known fields
export const parseEventBody = (body: unknown): ParsedEventBody => {
  const { fullName, date, duration, price, deposit, notes, includesTest, testDate } = (body ?? {}) as EventType

  const error = getEventFormError({ fullName, date, duration, price, deposit, notes })
  if (error) return { error }

  if (testDate !== undefined && getDateError(testDate)) return { error: 'Ingresá una fecha de prueba válida' }

  return {
    data: {
      fullName,
      date,
      duration: Number(duration) as EventType['duration'],
      price,
      deposit,
      includesTest: includesTest === true,
      ...(testDate !== undefined && { testDate }),
      ...(notes !== undefined && { notes })
    }
  }
}
