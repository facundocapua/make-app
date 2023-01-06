export const minutesOptions = ['00', '15', '30', '45']
export const hoursOptions = Array(24).fill(0).map((_, i) => String(i).padStart(2, '0'))
export const timeOptions = hoursOptions.map(h => minutesOptions.map(m => (`${h}:${m}`))).flat()

export const durationOptions = ['30', '45', '60', '90', '120']
