import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import CreateEventForm from '@/components/Form/CreateEventForm'
import { authOptions } from '@/utils/auth-options'

export default async function CreatePage () {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (<CreateEventForm />)
}
