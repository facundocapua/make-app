import { GoogleApiError } from '@/services/google'
import { notFound, redirect } from 'next/navigation'

// Sends expired sessions to sign-in and missing items to the 404 page; anything else reaches error.tsx
export function handlePageError (error: unknown): never {
  if (error instanceof GoogleApiError) {
    if (error.status === 401) redirect('/api/auth/signin')
    if (error.status === 404 || error.status === 410) notFound()
  }

  throw error
}
