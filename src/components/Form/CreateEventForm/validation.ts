import type { EventType } from '@/types/event'
import { durationOptions } from '@/utils/datetime'

type EventFormData = Pick<EventType, 'fullName' | 'date' | 'duration' | 'price' | 'deposit'>

export const getEventFormError = ({ fullName, date, duration, price, deposit }: EventFormData) => {
  if (!fullName) return 'Ingresá un nombre'
  if (Number.isNaN(Date.parse(date))) return 'Ingresá una fecha válida'
  if (!durationOptions.includes(String(duration))) return 'Elegí una duración válida'
  if (!Number.isFinite(price) || price < 0) return 'El precio no puede ser negativo'
  if (!Number.isFinite(deposit) || deposit < 0) return 'La seña no puede ser negativa'
  if (deposit > price) return 'La seña no puede superar el precio'

  return null
}
