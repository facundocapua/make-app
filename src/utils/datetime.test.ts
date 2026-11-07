import { describe, expect, it } from 'vitest'
import { getZonedDay, startOfZonedDay, zonedDateTime } from './datetime'

describe('zonedDateTime', () => {
  it('reads the wall clock time in Argentina', () => {
    expect(zonedDateTime('2026-05-01', '10:30').toISOString()).toBe('2026-05-01T13:30:00.000Z')
  })

  it('crosses to the next UTC day late in the evening', () => {
    expect(zonedDateTime('2026-05-01', '23:59:59').toISOString()).toBe('2026-05-02T02:59:59.000Z')
  })

  it('uses the offset of the date, not the current one', () => {
    // Argentina was on daylight saving time (UTC-2) in January 2009
    expect(zonedDateTime('2009-01-15', '10:00').toISOString()).toBe('2009-01-15T12:00:00.000Z')
  })

  it('returns an invalid date for invalid input', () => {
    expect(Number.isNaN(zonedDateTime('', '10:00').getTime())).toBe(true)
  })
})

describe('getZonedDay', () => {
  it('uses the day in Argentina', () => {
    expect(getZonedDay(new Date('2026-05-02T02:00:00.000Z'))).toBe('2026-05-01')
    expect(getZonedDay(new Date('2026-05-02T03:00:00.000Z'))).toBe('2026-05-02')
  })

  it('returns an empty string for an invalid date', () => {
    expect(getZonedDay(new Date('nope'))).toBe('')
  })
})

describe('startOfZonedDay', () => {
  it('returns midnight in Argentina', () => {
    expect(startOfZonedDay(new Date('2026-05-02T02:00:00.000Z')).toISOString()).toBe('2026-05-01T03:00:00.000Z')
  })
})
