export const formatDate = (date: string) => {
  const dateObj = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    weekday: 'long'
  }

  return dateObj.toLocaleDateString('es-AR', options)
}

export const formatDateTime = (date: string) => {
  const dateObj = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit'
  }

  return dateObj.toLocaleDateString('es-AR', options)
}

export const formatTime = (date:string): string => {
  const dateObj = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  }
  return dateObj.toLocaleString('es-AR', options)
}
