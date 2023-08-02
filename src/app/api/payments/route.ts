// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { UserSession } from '@/types/session'
import type { PaymentType } from '@/types/payment'
import { appendRow } from '@/services/google/sheets'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

const handler = async (
  req: Request
) => {
  const data:PaymentType = await req.json()
  const session = await getServerSession(authOptions) as UserSession
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
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
  const result = await appendRow({ accessToken, spreadsheetId, range, data: rowData })
  const { error } = result
  if (error) {
    const { code, message } = error
    return NextResponse.json({ message }, { status: code })
  }

  return NextResponse.json(result)
}

export { handler as POST }
