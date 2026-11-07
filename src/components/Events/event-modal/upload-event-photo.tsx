'use client'

import type { EventType } from '@/types/event'
import { deletePictureAction, getUploadUrlAction, updateEventPictureAction } from './actions'
import { compressImage } from './compress-image'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, MAX_SOURCE_IMAGE_SIZE } from './upload-config'
import { useCallback, useState, useTransition } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { DeleteIcon, EnlargeIcon } from '@/components/Icons'
import Spinner from '@/components/Ui/Spinner'

type Props = {
  event: EventType
}

const acceptedImageTypes = Object.fromEntries(
  Object.keys(ALLOWED_IMAGE_TYPES).map((type): [string, string[]] => [type, []])
)

const uploadFile = async (file: File) => {
  const { uploadUrl, publicUrl } = await getUploadUrlAction(file.type, file.size)

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file
  })
  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`)
  }

  return publicUrl
}

export default function UploadEventPhoto ({ event }: Props) {
  const [isUploading, setIsUploading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const isSaving = isUploading || isPending

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsUploading(true)
    try {
      const compressed = await compressImage(file)
      if (compressed.size > MAX_IMAGE_SIZE) {
        toast.error('La imagen pesa demasiado. Probá con una de hasta 10 MB.', { position: 'top-center' })
        return
      }

      const publicUrl = await uploadFile(compressed)
      // Server actions report redirect() as a rejection, so this stays outside the catch path
      startTransition(() => updateEventPictureAction(event.id, publicUrl))
    } catch (e) {
      console.error(e)
      toast.error('Error al subir la imagen', { position: 'top-center' })
    } finally {
      setIsUploading(false)
    }
  }, [event.id])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected: () => {
      toast.error('Usá una imagen JPG, PNG, WEBP o HEIC de hasta 50 MB', { position: 'top-center' })
    },
    noDrag: true,
    accept: acceptedImageTypes,
    maxSize: MAX_SOURCE_IMAGE_SIZE
  })

  const handleDelete = () => {
    startTransition(() => deletePictureAction(event.id))
  }

  return (
    <form className='relative'>
      {isSaving && (
        <div className='absolute w-full h-full bg-black/40 rounded-lg z-10'>
          <Spinner className='w-8 h-8 text-gray-500' />
        </div>
      )}
      {
        event.picture
          ? (
            <div className='h-[220px] w-full overflow-hidden rounded-lg border-2 border-gray-400 relative'>
              <img className='object-cover ' src={event.picture} alt={event.fullName} />
              <div className='absolute top-0 right-0 flex gap-2'>
                <a href={event.picture} target='_blank' className='p-1' rel="noreferrer">
                  <EnlargeIcon className='w-6 h-6 text-gray-800' />
                </a>
                <button type='button' onClick={handleDelete} className='p-1'>
                  <DeleteIcon className='w-6 h-6 text-red-600' />
                </button>
              </div>
            </div>
          )
          : (
            <div {...getRootProps({ className: 'dropzone flex flex-col items-center justify-center pt-5 pb-6 border-2 border-gray-400 rounded-lg' })}>
              <input name='file' {...getInputProps()} />
              <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-400 ">
                <span className="font-semibold">Subir imagen de referencia</span>
              </p>
            </div>
          )
      }
    </form>
  )
}
