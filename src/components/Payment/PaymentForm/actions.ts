'use server'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import type { UserSession } from '@/types/session'
import { GoogleApiError } from '@/services/google'
import { appendRow } from '@/services/google/sheets'
import { authOptions } from '@/utils/auth-options'
import { getPaymentRow, isValidPayment } from '@/utils/payments'

export type SavePaymentResult = { ok: true } | { ok: false, error: string }

// Redirects to sign-in when the session is missing or Google rejects the token, so call it inside startTransition
export const savePaymentAction = async (payment: unknown): Promise<SavePaymentResult> => {
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    redirect('/api/auth/signin')
  }

  if (!isValidPayment(payment)) {
    return { ok: false, error: 'Revisá los datos del pago' }
  }

  let expired = false
  try {
    await appendRow({
      accessToken: String(session.accessToken),
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID ?? '',
      range: `${process.env.GOOGLE_SHEET_NAME}!A2:E`,
      data: { values: [getPaymentRow(payment)] }
    })
    return { ok: true }
  } catch (error) {
    console.error(error)
    expired = error instanceof GoogleApiError && error.status === 401
  }

  if (expired) {
    redirect('/api/auth/signin')
  }
  return { ok: false, error: 'No se pudo guardar el pago. Intentá de nuevo.' }
}
