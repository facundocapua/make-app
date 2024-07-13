import { Select, Text, DateField } from '@/components/Form/Elements'
import type { AlertsContextType } from '@/context/alerts'
import { AlertsContext } from '@/context/alerts'
import { savePayment } from '@/services/api/savePayment'
import { AlertType } from '@/types/alerts'
import type { PaymentType } from '@/types/payment'
import { PAYMENT_METHODS, SERVICES } from '@/types/payment'
import type { FormEvent } from 'react'
import { useContext } from 'react'
import useForm from './hook'

export default function PaymentForm () {
  const { addAlert } = useContext(AlertsContext) as AlertsContextType

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
    savePayment(state)
      .then(res => {
        console.log({ res })
        addAlert({ type: AlertType.SUCCESS, message: 'Pago guardado con éxito' })
        reset()
      }).catch(err => {
        console.error(err)
        addAlert({ type: AlertType.ERROR, message: 'Error al guardar el pago' })
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
      />

      <Select
        id='service'
        label='Servicio'
        value={String(service)}
        options={SERVICES}
        onChange={(value) => updateService(value as PaymentType['service'])}
      />

      <button type='submit' className='p-2 mx-2 text-gray-100 bg-gray-700 border-2 border-gray-400 rounded-xl hover:bg-gray-300 hover:text-gray-700'>Guardar</button>
    </form>
  )
}
