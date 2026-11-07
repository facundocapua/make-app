'use client'

import React, { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { Text, DateTimeField, Select } from '@/components/Form/Elements'
import useForm from './hook'
import { durationOptions } from '@/utils/datetime'
import { createEventAction } from './actions'

export default function CreateEventForm () {
  const [actionState, formAction, isPending] = useActionState(createEventAction, null)

  useEffect(() => {
    if (actionState?.error) {
      toast.error(actionState.error, { position: 'top-center' })
    }
  }, [actionState])

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

  return (
    <form action={formAction} className='flex flex-col content-center justify-center p-2 mx-4 bg-gray-600 rounded-lg'>
      <Text
        id="fullName"
        label="Nombre"
        value={fullName}
        onChange={updateFullname}
        required
      />

      <DateTimeField id='date' label='Fecha' value={date} onChange={updateDate} />

      <Select id='duration' label='Duración (minutos)' value={String(duration)} options={durationOptions} onChange={(value) => updateDuration(Number(value))} />

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
        id='price'
        label="Precio"
        value={String(price)}
        onChange={updatePrice}
        type='number'
        min={0}
      />

      <Text
        id='deposit'
        label="Seña"
        value={String(deposit)}
        onChange={updateDeposit}
        type='number'
        min={0}
      />

      <Text
        id='notes'
        label="Notas"
        value={String(notes)}
        onChange={updateNotes}
        type='textarea'
      />

      <button type='submit' disabled={isPending} className='p-2 mx-2 text-gray-100 bg-gray-700 border-2 border-gray-400 rounded-xl hover:bg-gray-300 hover:text-gray-700 disabled:opacity-50 disabled:pointer-events-none'>
        {isPending ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}
