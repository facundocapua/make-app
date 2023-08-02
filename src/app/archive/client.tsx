'use client'

import ArchiveEventList from '@/components/Events/ArchiveEventList'
import Spinner from '@/components/Ui/Spinner'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function ArchiveClient () {
  const { status } = useSession({
    required: true,
    onUnauthenticated () {
      redirect('/api/auth/signin')
    }
  })

  if (status === 'loading') {
    return <Spinner />
  }

  return (<ArchiveEventList />)
}
