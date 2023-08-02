'use client'

import GroupedEventList from '@/components/Events/GroupedEventList'
import Spinner from '@/components/Ui/Spinner'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function HomeClient () {
  const { status } = useSession({
    required: true,
    onUnauthenticated () {
      redirect('/api/auth/signin')
    }
  })

  if (status === 'loading') {
    return <Spinner />
  }

  return (<GroupedEventList />)
}
