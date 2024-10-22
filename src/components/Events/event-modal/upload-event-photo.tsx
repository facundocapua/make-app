'use client'

import type { EventType } from '@/types/event'
import { deletePictureAction, getUploadClientDataAction, updateEventPictureAction } from './actions'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { DeleteIcon, EnlargeIcon } from '@/components/Icons'
import Spinner from '@/components/Ui/Spinner'
import S3 from 'aws-sdk/clients/s3.js'

type Props = {
  event: EventType
}

const uploadFile = async (bucketData: Record<string, string>, file: File) => {
  const { bucket, publicUrl, ...clientData } = bucketData

  const fileExt = file.name.split('.').pop()
  const fileName = `${self.crypto.randomUUID()}.${fileExt}`

  const client = new S3(clientData)

  try {
    const params = {
      Bucket: bucket,
      Key: fileName,
      Body: file,
      // ACL: 'public-read'
      ContentType: file.type
    }
    await client.upload(
      params, {
        partSize: 50 * 1024 * 1024, queueSize: 1
      }).promise()

    return { url: `${publicUrl}/${fileName}` }
  } catch (e) {
    console.log(e)
  }
}

export default function UploadEventPhoto ({ event }: Props) {
  const uploadPhotoSubmit = updateEventPictureAction.bind(null, event)
  const deletePhotoSubmit = deletePictureAction.bind(null, event)
  const [isSaving, setIsSaving] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsSaving(true)
    const file = acceptedFiles[0]
    getUploadClientDataAction().then(clientData => {
      uploadFile(clientData, file).then(data => {
        if (!data) return
        uploadPhotoSubmit(data.url).then(() => {
          setIsSaving(false)
        })
      })
    })
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noDrag: true,
    accept: { 'image/*': [] }
  })

  const handleDelete = () => {
    setIsSaving(true)
    deletePhotoSubmit()
      .then(() => setIsSaving(false))
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
