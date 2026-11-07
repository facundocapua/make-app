'use server'

import type { EventType } from '@/types/event'
import { randomUUID } from 'crypto'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth-options'
import type { UserSession } from '@/types/session'
import { CALENDAR_NAME, getCalendar } from '@/services/google'
import { generateEventObject } from '@/utils/google'
import { deleteEvent, getEvent, updateEvent } from '@/services/google/events'
import { redirect } from 'next/navigation'
import { setNotification } from '@/components/toaster/toaster'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from './upload-config'

const UPLOAD_URL_EXPIRATION_SECONDS = 300

const getClient = () => new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY ?? '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY ?? ''
  },
  // By default the SDK adds a checksum to presigned URLs, computed before the file is known
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED'
})

// Returns the bucket key only for URLs that belong to our bucket
const getPictureKey = (picture: string) => {
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL ?? ''
  if (!publicUrl || !picture.startsWith(`${publicUrl}/`)) return null

  const key = picture.slice(publicUrl.length + 1)
  return key && !key.includes('/') ? key : null
}

export const updateEventAction = async (event: EventType) => {
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    throw new Error('Unauthorized')
  }
  const { accessToken } = session

  try {
    const { id: calendarId } = await getCalendar({ name: CALENDAR_NAME, accessToken: String(accessToken) })
    const eventData = generateEventObject(event)
    await updateEvent({ calendarId, event: { id: event.id, ...eventData }, accessToken: String(accessToken) })

    await setNotification({ type: 'success', message: 'Evento actualizado correctamente' })
  } catch (e) {
    console.error(e)
    await setNotification({ type: 'error', message: 'No se pudo guardar el cambio. Intentá de nuevo.' })
  }

  redirect(`/event/${event.id}`)
}

export const getUploadUrlAction = async (type: string, size: number) => {
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    throw new Error('Unauthorized')
  }

  const extension = Object.hasOwn(ALLOWED_IMAGE_TYPES, type) ? ALLOWED_IMAGE_TYPES[type] : null
  if (!extension || !Number.isInteger(size) || size <= 0 || size > MAX_IMAGE_SIZE) {
    throw new Error('Invalid file')
  }

  const key = `${randomUUID()}.${extension}`
  const uploadUrl = await getSignedUrl(
    getClient(),
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME ?? '',
      Key: key,
      ContentType: type,
      ContentLength: size
    }),
    {
      expiresIn: UPLOAD_URL_EXPIRATION_SECONDS,
      // The SDK leaves content-type out of the signature unless it is listed here
      signableHeaders: new Set(['content-type', 'content-length'])
    }
  )

  return { uploadUrl, publicUrl: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}` }
}

export const updateEventPictureAction = async (eventId: EventType['id'], picture: string) => {
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    throw new Error('Unauthorized')
  }
  const { accessToken } = session

  if (!getPictureKey(picture)) {
    throw new Error('Invalid picture URL')
  }

  const calendar = await getCalendar({ name: CALENDAR_NAME, accessToken: String(accessToken) })
  const { id: calendarId } = calendar

  try {
    const event = await getEvent({ calendarId, eventId, accessToken: String(accessToken) })
    const eventData = generateEventObject({ ...event, picture })
    await updateEvent({ calendarId, event: { id: eventId, ...eventData }, accessToken: String(accessToken) })

    await setNotification({ type: 'success', message: 'Imagen subida correctamente' })
  } catch (e) {
    await setNotification({ type: 'error', message: 'Error al subir la imagen' })
    console.error(e)
  }

  redirect(`/event/${eventId}`)
}

export const deletePictureAction = async (eventId: EventType['id']) => {
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    throw new Error('Unauthorized')
  }
  const { accessToken } = session

  const calendar = await getCalendar({ name: CALENDAR_NAME, accessToken: String(accessToken) })
  const { id: calendarId } = calendar
  try {
    // The key comes from the stored event, never from the client
    const event = await getEvent({ calendarId, eventId, accessToken: String(accessToken) })
    const key = getPictureKey(event.picture ?? '')
    if (!key) {
      throw new Error('Invalid picture URL')
    }

    await getClient().send(new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME ?? '',
      Key: key
    }))

    const eventData = generateEventObject({ ...event, picture: '' })
    await updateEvent({ calendarId, event: { id: eventId, ...eventData }, accessToken: String(accessToken) })
    await setNotification({ type: 'success', message: 'Imagen eliminada correctamente' })
  } catch (e) {
    await setNotification({ type: 'error', message: 'Error al eliminar la imagen' })
    console.error(e)
  }

  redirect(`/event/${eventId}`)
}

export const deleteItem = async (eventId: EventType['id']) => {
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    throw new Error('Unauthorized')
  }
  const { accessToken } = session

  let picture = ''
  try {
    const { id: calendarId } = await getCalendar({ name: CALENDAR_NAME, accessToken: String(accessToken) })
    const event = await getEvent({ calendarId, eventId, accessToken: String(accessToken) })
    picture = event.picture ?? ''
    await deleteEvent({ calendarId, eventId, accessToken: String(accessToken) })
  } catch (e) {
    console.error(e)
    return { ok: false }
  }

  // The event is already gone, so a failure here only leaves an orphaned picture
  const key = getPictureKey(picture)
  if (key) {
    try {
      await getClient().send(new DeleteObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME ?? '',
        Key: key
      }))
    } catch (e) {
      console.error(e)
    }
  }

  return { ok: true }
}
