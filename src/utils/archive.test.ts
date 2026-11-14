import { describe, expect, it } from 'vitest'
import type { EventType } from '@/types/event'
import { appendOlderEvents, getFirstArchiveYear, getYearBefore } from './archive'

const event = (id: string) => ({ id }) as EventType

describe('getFirstArchiveYear', () => {
  it('ends now and starts at midnight in Argentina one year ago', () => {
    const now = new Date('2026-11-12T15:30:00.000Z')
    expect(getFirstArchiveYear(now)).toEqual({
      since: new Date('2025-11-12T03:00:00.000Z'),
      to: now
    })
  })
})

describe('getYearBefore', () => {
  it('leaves no gap between consecutive years', () => {
    const first = getFirstArchiveYear(new Date('2026-11-12T15:30:00.000Z'))
    expect(getYearBefore(first.since)).toEqual(new Date('2024-11-12T03:00:00.000Z'))
  })

  it('does not change its argument', () => {
    const to = new Date('2026-01-01T03:00:00.000Z')
    getYearBefore(to)
    expect(to.toISOString()).toBe('2026-01-01T03:00:00.000Z')
  })
})

describe('appendOlderEvents', () => {
  it('appends older events after the current ones', () => {
    expect(appendOlderEvents([event('a')], [event('b'), event('c')]).map(({ id }) => id)).toEqual(['a', 'b', 'c'])
  })

  it('skips an event already loaded with the newer year', () => {
    expect(appendOlderEvents([event('a'), event('b')], [event('b'), event('c')]).map(({ id }) => id)).toEqual(['a', 'b', 'c'])
  })
})
