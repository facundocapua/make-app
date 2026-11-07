import { describe, expect, it } from 'vitest'
import { timeOptions } from './datetime'
import { formatDate, formatDateComputer, formatDateShort, formatDateTime, formatTime } from './format'

// 01:00 of May 2 in UTC is still May 1 in Argentina
const LATE_EVENING = '2026-05-02T01:00:00.000Z'

describe('date formatters', () => {
  it('show the day in Argentina', () => {
    expect(formatDateComputer(LATE_EVENING)).toBe('2026-05-01')
    expect(formatDateShort(LATE_EVENING)).toMatch(/^0?1\/0?5$/)
    expect(formatDate(LATE_EVENING)).toContain('viernes')
    expect(formatDateTime(LATE_EVENING)).toContain('22:00')
  })

  it('do not throw on an invalid date', () => {
    expect(formatDateComputer('nope')).toBe('')
    expect(() => formatDate('nope')).not.toThrow()
    expect(() => formatTime('nope')).not.toThrow()
  })
})

describe('formatTime', () => {
  it('shows the time in Argentina', () => {
    expect(formatTime('2026-05-01T13:30:00.000Z')).toBe('10:30')
  })

  it('rounds to 15 minutes unless told otherwise', () => {
    expect(formatTime('2026-05-01T13:37:00.000Z')).toBe('10:30')
    expect(formatTime('2026-05-01T13:38:00.000Z')).toBe('10:45')
    expect(formatTime('2026-05-01T13:37:00.000Z', false)).toBe('10:37')
  })

  it('carries over to the next hour', () => {
    expect(formatTime('2026-05-01T13:55:00.000Z')).toBe('11:00')
  })

  it('always returns a value the time select can show', () => {
    // Midnight must be 00:00: some engines format it as 24:00 with hour12: false
    expect(formatTime('2026-05-01T03:00:00.000Z')).toBe('00:00')
    expect(timeOptions).toContain(formatTime('2026-05-01T03:00:00.000Z'))
    expect(timeOptions).toContain(formatTime('2026-05-01T16:22:00.000Z'))
  })
})
