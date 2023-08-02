'use client'

import PaymentForm from '@/components/Payment/PaymentForm'
import Spinner from '@/components/Ui/Spinner'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function PaymentClient () {
  const { status } = useSession({
    required: true,
    onUnauthenticated () {
      redirect('/api/auth/signin')
    }
  })

  if (status === 'loading') {
    return <Spinner />
  }

  return (<PaymentForm />)
}
