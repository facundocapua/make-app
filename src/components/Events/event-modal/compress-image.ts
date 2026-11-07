const MAX_DIMENSION = 1600
const JPEG_QUALITY = 0.8

export const getScaledSize = (width: number, height: number, max = MAX_DIMENSION) => {
  const scale = Math.min(1, max / Math.max(width, height))
  return { width: Math.round(width * scale), height: Math.round(height * scale) }
}

// Phone photos weigh several MB, but a reference picture is only looked at on a phone screen.
// Anything that can't be compressed, such as HEIC in most browsers, is uploaded as it is.
export const compressImage = async (file: File): Promise<File> => {
  try {
    const bitmap = await createImageBitmap(file)
    const { width, height } = getScaledSize(bitmap.width, bitmap.height)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) return file

    // JPEG has no transparency, which would otherwise turn black
    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)
    context.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY))
    if (!blob || blob.size >= file.size) return file

    return new File([blob], file.name.replace(/\.[^.]*$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch (e) {
    console.error(e)
    return file
  }
}
