'use client'

import CreateEventForm from '@/components/Form/CreateEventForm'
import Spinner from '@/components/Ui/Spinner'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function CreateClient () {
  const { status } = useSession({
    required: true,
    onUnauthenticated () {
      redirect('/api/auth/signin')
    }
  })

  if (status === 'loading') {
    return <Spinner />
  }

  return (<CreateEventForm />)
}
