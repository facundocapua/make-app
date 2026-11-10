export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif'
}

// The limit for what gets uploaded, after compressing in the browser
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024
// The limit for what the browser tries to compress
export const MAX_SOURCE_IMAGE_SIZE = 50 * 1024 * 1024
