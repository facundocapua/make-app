import React, { useContext } from 'react'
import { Text, DateTimeField, Select } from '@/components/Form/Elements'
import type { AlertsContextType } from '@/context/alerts'
import { AlertsContext } from '@/context/alerts'
import { AlertType } from '@/types/alerts'
import { useRouter } from 'next/navigation'
import useForm from './hook'
import { saveEvent } from '@/services/api/saveEvent'
import { durationOptions } from '@/utils/datetime'

export default function CreateEventForm () {
  const { addAlert } = useContext(AlertsContext) as AlertsContextType
  const router = useRouter()

  const {
    updateFullname,
    updateDate,
    updateDuration,
    updateDeposit,
    updatePrice,
    updateNotes,
    ...state
  } = useForm()
  const { fullName, date, deposit, price, duration, notes } = state

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    saveEvent(state)
      .then(res => {
        console.log({ res })
        addAlert({ type: AlertType.SUCCESS, message: 'Evento guardado con éxito' })
        router.push('/')
      }).catch(err => {
        console.error(err)
        addAlert({ type: AlertType.ERROR, message: 'Error al guardar el evento' })
      })
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col content-center justify-center p-2 mx-4 bg-gray-600 rounded-lg'>
      <Text
        label="Nombre"
        value={fullName}
        onChange={updateFullname}
      />

      <DateTimeField label='Fecha' value={date} onChange={updateDate} />

      <Select label='Duración (minutos)' value={String(duration)} options={durationOptions} onChange={(value) => updateDuration(Number(value))} />

      {/* <Toggle label="¿Incluye prueba?" checked={includesTest} onChange={updateIncludesTest} />

      {includesTest && (
        <Text
          label="Fecha de la prueba"
          value={testDate || ''}
          onChange={updateTestDate}
          type='datetime-local'
        />
      )} */}

      <Text
        label="Precio"
        value={String(price)}
        onChange={updatePrice}
        type='number'
      />

      <Text
        label="Seña"
        value={String(deposit)}
        onChange={updateDeposit}
        type='number'
      />

      <Text
        label="Notas"
        value={String(notes)}
        onChange={updateNotes}
        type='textarea'
      />

      <button type='submit' className='p-2 mx-2 text-gray-100 bg-gray-700 border-2 border-gray-400 rounded-xl hover:bg-gray-300 hover:text-gray-700'>Guardar</button>
    </form>
  )
}
