import type { EventType } from '@/types/event'

export const makeEvent = (id: string, date: string, fields: Partial<EventType> = {}): EventType => ({
  id,
  fullName: `Clienta ${id}`,
  date,
  duration: 60,
  price: 100,
  deposit: 50,
  includesTest: false,
  ...fields
})
