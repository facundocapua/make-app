'use server'

import type { EventType } from '@/types/event'
import { randomUUID } from 'crypto'
import S3 from 'aws-sdk/clients/s3.js'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/auth-options'
import type { UserSession } from '@/types/session'
import { CALENDAR_NAME, getCalendar } from '@/services/google'
import { generateEventObject } from '@/utils/google'
import { deleteEvent, updateEvent } from '@/services/google/events'
import { redirect } from 'next/navigation'

export const uploadEventPhotoAction = async (event: EventType, data: FormData) => {
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    throw new Error('No file uploaded')
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type')
  }

  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    throw new Error('Unauthorized')
  }
  const { accessToken } = session

  const calendar = await getCalendar({ name: CALENDAR_NAME, accessToken: String(accessToken) })
  const { id: calendarId } = calendar

  const fileExt = file.name.split('.').pop()
  const fileName = `${randomUUID()}.${fileExt}`

  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL ?? ''

  const client = new S3({
    region: 'auto',
    signatureVersion: 'v4',
    endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY ?? '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY ?? ''
  })

  try {
    const buffer = Buffer.from(await file.arrayBuffer())

    const params = {
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME ?? '',
      Key: fileName,
      Body: buffer,
      // ACL: 'public-read'
      ContentType: file.type
    }

    await client.upload(params).promise()

    const newData = { ...event, picture: `${publicUrl}/${fileName}` }
    const eventData = generateEventObject(newData)
    await updateEvent({ calendarId, event: { id: event.id, ...eventData }, accessToken: String(accessToken) })

    return { message: 'Event photo uploaded', event: newData }
  } catch (e) {
    console.log(e)
  }
}

export const deleteItem = async (eventId: EventType['id']) => {
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    throw new Error('Unauthorized')
  }
  const { accessToken } = session

  const calendar = await getCalendar({ name: CALENDAR_NAME, accessToken: String(accessToken) })
  const { id: calendarId } = calendar
  await deleteEvent({ calendarId, eventId, accessToken })

  redirect('/')
}
