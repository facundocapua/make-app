'use client'

import { Select, Text, DateField } from '@/components/Form/Elements'
import type { PaymentType } from '@/types/payment'
import { PAYMENT_METHODS, SERVICES } from '@/types/payment'
import type { FormEvent } from 'react'
import { useTransition } from 'react'
import { toast } from 'sonner'
import useForm from './hook'
import { savePaymentAction } from './actions'

export default function PaymentForm () {
  const [isSaving, startTransition] = useTransition()

  const {
    updateDate,
    updatePaymentMethod,
    updateDescription,
    updateAmount,
    updateService,
    // updateClientId,
    reset,
    ...state
  } = useForm()
  const { date, paymentMethod, description, amount, service } = state

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSaving) return

    if (!(amount > 0)) {
      toast.error('Ingresá un monto mayor a cero', { position: 'top-center' })
      return
    }

    // A transition, because the action redirects to sign-in when the session expired
    startTransition(async () => {
      const result = await savePaymentAction(state).catch(() => null)
      if (!result) {
        toast.error('No se pudo guardar el pago. Intentá de nuevo.', { position: 'top-center' })
      } else if (!result.ok) {
        toast.error(result.error, { position: 'top-center' })
      } else {
        toast.success('Pago guardado con éxito', { position: 'top-center' })
        reset()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col content-center justify-center p-2 mx-4 bg-gray-600 rounded-lg'>
      <h1 className='mb-4 text-xl text-center text-white '>Registrar pago</h1>

      <DateField label='Fecha' value={date} onChange={updateDate} />

      <Select
        id='paymentMethod'
        label='Forma de pago'
        value={String(paymentMethod)}
        options={PAYMENT_METHODS}
        onChange={(value) => updatePaymentMethod(value as PaymentType['paymentMethod'])}
      />

      <Text
        id='description'
        label="Description"
        value={String(description)}
        onChange={updateDescription}
        type='text'
      />

      <Text
        id='amount'
        label="Monto"
        value={String(amount)}
        onChange={(value) => updateAmount(Number(value))}
        type='number'
        min={0}
      />

      <Select
        id='service'
        label='Servicio'
        value={String(service)}
        options={SERVICES}
        onChange={(value) => updateService(value as PaymentType['service'])}
      />

      <button type='submit' disabled={isSaving} className='p-2 mx-2 text-gray-100 bg-gray-700 border-2 border-gray-400 rounded-xl hover:bg-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:pointer-events-none'>
        {isSaving ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}
