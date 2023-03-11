export type EventType = {
  id: string,
  fullName: string,
  date: string,
  price: number,
  deposit: number,
  duration: 30 | 45 | 60 | 90 | 120,
  includesTest: boolean,
  testDate?: string,
  notes?: string
}

export type GroupedEventItemType = {
  date: string,
  events: Array<EventType>,
}

export type GroupedEventCollection = {
  [key: string]: GroupedEventItemType
}
