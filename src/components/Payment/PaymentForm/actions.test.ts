import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import type { PaymentType } from '@/types/payment'
import { GoogleApiError } from '@/services/google'
import { appendRow } from '@/services/google/sheets'
import { savePaymentAction } from './actions'

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }))
vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => { throw new Error('NEXT_REDIRECT') })
}))
vi.mock('@/utils/auth-options', () => ({ authOptions: {} }))
vi.mock('@/services/google/sheets', () => ({ appendRow: vi.fn() }))
vi.mock('@/services/google', () => ({
  GoogleApiError: class extends Error {
    status: number
    constructor (status: number) {
      super('Google API error')
      this.status = status
    }
  }
}))

const payment: PaymentType = {
  date: '2026-05-02T01:00:00.000Z',
  paymentMethod: 'Efectivo',
  description: 'Seña',
  service: 'Maquillaje',
  amount: 1000,
  clientId: ''
}

const GoogleError = GoogleApiError as unknown as new (status: number) => Error

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('GOOGLE_SPREADSHEET_ID', 'sheet')
  vi.stubEnv('GOOGLE_SHEET_NAME', 'Ingresos')
  vi.mocked(getServerSession).mockResolvedValue({ accessToken: 'token' })
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('savePaymentAction', () => {
  it('appends the ledger row', async () => {
    await expect(savePaymentAction(payment)).resolves.toEqual({ ok: true })
    expect(appendRow).toHaveBeenCalledWith({
      accessToken: 'token',
      spreadsheetId: 'sheet',
      range: 'Ingresos!A2:E',
      data: { values: [['1/5/2026', 'Efectivo', 'Seña', 'Maquillaje', 1000, '']] }
    })
  })

  it('sends a missing session to sign-in without writing', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    await expect(savePaymentAction(payment)).rejects.toThrow('NEXT_REDIRECT')
    expect(redirect).toHaveBeenCalledWith('/api/auth/signin')
    expect(appendRow).not.toHaveBeenCalled()
  })

  it('rejects an invalid payment without writing', async () => {
    await expect(savePaymentAction({ ...payment, amount: 0 })).resolves.toEqual({ ok: false, error: expect.any(String) })
    expect(appendRow).not.toHaveBeenCalled()
  })

  it('sends an expired token to sign-in', async () => {
    vi.mocked(appendRow).mockRejectedValue(new GoogleError(401))
    await expect(savePaymentAction(payment)).rejects.toThrow('NEXT_REDIRECT')
    expect(redirect).toHaveBeenCalledWith('/api/auth/signin')
  })

  it('returns an error when Sheets fails', async () => {
    vi.mocked(appendRow).mockRejectedValue(new GoogleError(500))
    await expect(savePaymentAction(payment)).resolves.toEqual({ ok: false, error: expect.any(String) })
    expect(redirect).not.toHaveBeenCalled()
  })
})
