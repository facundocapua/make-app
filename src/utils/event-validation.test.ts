import { describe, expect, it } from 'vitest'
import type { EventType } from '@/types/event'
import {
  getEventChangesError,
  getEventFormError,
  MAX_NAME_LENGTH,
  MAX_NOTES_LENGTH,
  parseEventBody,
  pickEventChanges
} from './event-validation'

const form = { fullName: 'Ana', date: '2026-05-01T12:00:00.000Z', duration: 60 as const, price: 100, deposit: 50 }
const current = { ...form, id: 'e1', includesTest: false } as EventType

describe('getEventFormError', () => {
  it('accepts valid data', () => {
    expect(getEventFormError(form)).toBeNull()
    expect(getEventFormError({ ...form, price: 0, deposit: 0 })).toBeNull()
  })

  it.each([
    ['empty name', { fullName: '' }],
    ['blank name', { fullName: '   ' }],
    ['long name', { fullName: 'a'.repeat(MAX_NAME_LENGTH + 1) }],
    ['invalid date', { date: 'null' }],
    ['non-string date', { date: 0 }],
    ['invalid duration', { duration: 33 }],
    ['negative price', { price: -1 }],
    ['NaN price', { price: NaN }],
    ['text price', { price: '100' }],
    ['negative deposit', { deposit: -1 }],
    ['deposit over price', { deposit: 200 }],
    ['long notes', { notes: 'a'.repeat(MAX_NOTES_LENGTH + 1) }],
    ['non-string notes', { notes: 1 }]
  ])('rejects %s', (_name, change) => {
    expect(getEventFormError({ ...form, ...change } as typeof form)).not.toBeNull()
  })
})

describe('pickEventChanges', () => {
  it('drops the fields the client cannot edit', () => {
    const changes = { fullName: 'Eva', picture: 'https://evil.example/x.png', id: 'other', duration: 30 }
    expect(pickEventChanges(changes)).toEqual({ fullName: 'Eva' })
  })
})

describe('getEventChangesError', () => {
  it('accepts valid changes', () => {
    expect(getEventChangesError({ fullName: 'Eva' }, current)).toBeNull()
    expect(getEventChangesError({ notes: '' }, current)).toBeNull()
  })

  it('compares a new price with the stored deposit', () => {
    expect(getEventChangesError({ price: 10 }, current)).toBe('La seña no puede superar el precio')
    expect(getEventChangesError({ price: 50 }, current)).toBeNull()
  })

  it('compares a new deposit with the stored price', () => {
    expect(getEventChangesError({ deposit: 101 }, current)).toBe('La seña no puede superar el precio')
  })

  it('rejects invalid values', () => {
    expect(getEventChangesError({ fullName: '' }, current)).not.toBeNull()
    expect(getEventChangesError({ date: 'nope' }, current)).not.toBeNull()
    expect(getEventChangesError({ notes: 1 as unknown as string }, current)).not.toBeNull()
  })

  it('ignores fields that do not change, even if they would not pass', () => {
    // An event added by hand in Google Calendar can have any duration or an empty name
    const manual = { ...current, fullName: '', duration: 75 } as unknown as EventType
    expect(getEventChangesError({ notes: 'hola' }, manual)).toBeNull()
  })
})

describe('parseEventBody', () => {
  it('keeps only the known fields', () => {
    const body = { ...form, picture: 'https://evil.example/x.png', id: 'other', extra: true }
    expect(parseEventBody(body)).toEqual({ data: { ...form, includesTest: false } })
  })

  it('keeps the optional fields', () => {
    const body = { ...form, notes: 'hola', includesTest: true, testDate: '2026-04-01T12:00:00.000Z' }
    expect(parseEventBody(body)).toEqual({ data: body })
  })

  it.each([
    ['null', null],
    ['a number', 1],
    ['an array', []],
    ['invalid data', { ...form, price: -1 }],
    ['invalid test date', { ...form, testDate: 'nope' }]
  ])('rejects %s', (_name, body) => {
    expect(parseEventBody(body)).toHaveProperty('error')
  })
})
