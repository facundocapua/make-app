import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import PaymentForm from '@/components/Payment/PaymentForm'
import { authOptions } from '@/utils/auth-options'

export default async function PaymentPage () {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (<PaymentForm />)
}
