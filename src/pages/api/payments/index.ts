// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import type { UserSession } from '@/types/session'
import type { PaymentType } from '@/types/payment'
import { appendRow } from '@/services/google/sheets'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<PaymentType | any>
) {
  const { method } = req
  if (method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const data:PaymentType = req.body
  const session = await getServerSession(req, res, authOptions) as UserSession
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
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
    return res.status(code).json({ message })
  }
  res.status(200).json(result)
}
