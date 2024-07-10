'use client'

import React from 'react'
import { Text, DateTimeField, Select } from '@/components/Form/Elements'
import useForm from './hook'
import { durationOptions } from '@/utils/datetime'
import { createEventAction } from './actions'

export default function CreateEventForm () {
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
    <form action={createEventAction} className='flex flex-col content-center justify-center p-2 mx-4 bg-gray-600 rounded-lg'>
      <Text
        id="fullName"
        label="Nombre"
        value={fullName}
        onChange={updateFullname}
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
      />

      <Text
        id='deposit'
        label="Seña"
        value={String(deposit)}
        onChange={updateDeposit}
        type='number'
      />

      <Text
        id='notes'
        label="Notas"
        value={String(notes)}
        onChange={updateNotes}
        type='textarea'
      />

      <button type='submit' className='p-2 mx-2 text-gray-100 bg-gray-700 border-2 border-gray-400 rounded-xl hover:bg-gray-300 hover:text-gray-700'>Guardar</button>
    </form>
  )
}
