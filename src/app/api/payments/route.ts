// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { UserSession } from '@/types/session'
import type { PaymentType } from '@/types/payment'
import { PAYMENT_METHODS, SERVICES } from '@/types/payment'
import { GoogleApiError } from '@/services/google'
import { appendRow } from '@/services/google/sheets'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/utils/auth-options'

const isValidPayment = ({ date, paymentMethod, service, amount }: PaymentType) => {
  return !Number.isNaN(Date.parse(date)) &&
    PAYMENT_METHODS.includes(paymentMethod) &&
    SERVICES.includes(service) &&
    Number(amount) > 0
}

const handler = async (
  req: Request
) => {
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const data:PaymentType = await req.json()
  if (!isValidPayment(data)) {
    return NextResponse.json({ message: 'Invalid payment' }, { status: 400 })
  }

  const { accessToken } = session
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID ?? ''
  const range = `${process.env.GOOGLE_SHEET_NAME}!A2:E`
  const parsedData = {
    ...data,
    date: new Date(data.date).toLocaleDateString('es-AR')
  }
  const rowData = {
    values: [
      Object.values(parsedData)
    ]
  }

  try {
    const result = await appendRow({ accessToken, spreadsheetId, range, data: rowData })
    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    const status = error instanceof GoogleApiError ? error.status : 500
    return NextResponse.json({ message: 'Could not save payment' }, { status })
  }
}

export { handler as POST }
