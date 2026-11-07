import { describe, expect, it } from 'vitest'
import type { EventType } from '@/types/event'
import { groupByDate } from './events'

const event = (id: string, date: string) => ({ id, date }) as EventType

describe('groupByDate', () => {
  it('groups by the day in Argentina', () => {
    const groups = groupByDate([
      event('morning', '2026-05-01T13:00:00.000Z'),
      event('late', '2026-05-02T01:00:00.000Z'),
      event('next-day', '2026-05-02T13:00:00.000Z')
    ])

    expect(groups.map(({ date, events }) => [date, events.map(({ id }) => id)])).toEqual([
      ['2026-05-02T02:59:59.000Z', ['morning', 'late']],
      ['2026-05-03T02:59:59.000Z', ['next-day']]
    ])
  })

  it('sorts the events of a day by time', () => {
    const [group] = groupByDate([
      event('second', '2026-05-01T15:00:00.000Z'),
      event('first', '2026-05-01T13:00:00.000Z')
    ])

    expect(group.events.map(({ id }) => id)).toEqual(['first', 'second'])
  })

  it('does not throw on an invalid date', () => {
    expect(groupByDate([event('bad', 'nope')])).toHaveLength(1)
  })
})
