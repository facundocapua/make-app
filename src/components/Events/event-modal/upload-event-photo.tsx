'use client'

import type { EventType } from '@/types/event'
import { uploadEventPhotoAction } from './actions'
import { useRef } from 'react'

type Props = {
  event: EventType
}

export default function UploadEventPhoto ({ event }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const uploadPhotoSubmit = uploadEventPhotoAction.bind(null, event)

  const handleChange = () => {
    if (formRef.current) {
      formRef.current.requestSubmit()
    }
  }

  return (
    <form ref={formRef} action={uploadPhotoSubmit}>
      <input type='file' name="file" accept="image/*" onChange={handleChange} />
      {event.picture &&
        <a href={event.picture}>
          <img className='max-h-[300px] object-cover' src={event.picture} alt={event.fullName} />
        </a>
      }
    </form>
  )
}
