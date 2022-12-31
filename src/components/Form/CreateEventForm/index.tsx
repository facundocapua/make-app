import React, { useContext } from 'react'
import { Toggle, Text } from '@/components/Form/Elements'
import { AlertsContext, AlertsContextType } from '@/context/alerts'
import { AlertType } from '@/types/alerts'
import { useRouter } from 'next/router'
import useForm from './hook'
import { saveEvent } from '@/services/api/saveEvent'
import Slider from '../Elements/Slider'

export default function CreateEventForm () {
  const { addAlert } = useContext(AlertsContext) as AlertsContextType
  const router = useRouter()

  const {
    updateFullname,
    updateDate,
    updateDuration,
    updateIncludesTest,
    updateTestDate,
    updateDeposit,
    updatePrice,
    ...state
  } = useForm()
  const { fullName, date, includesTest, testDate, deposit, price, duration } = state

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
    <form onSubmit={handleSubmit} className='flex flex-col content-center justify-center p-2 mx-4 rounded-lg bg-rose-200'>
      <Text
        label="Nombre"
        value={fullName}
        onChange={updateFullname}
      />

      <Text
        label="Fecha"
        value={date}
        onChange={updateDate}
        type='datetime-local'
      />

      <Slider label="Duración (minutos)" value={duration} min={30} max={120} step={15} onChange={updateDuration} />

      <Toggle label="¿Incluye prueba?" checked={includesTest} onChange={updateIncludesTest} />

      {includesTest && (
        <Text
          label="Fecha de la prueba"
          value={testDate || ''}
          onChange={updateTestDate}
          type='datetime-local'
        />
      )}

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

      <button type='submit' className='p-2 mx-2 border-2 bg-rose-300 border-rose-400 rounded-xl hover:bg-rose-400 hover:text-rose-100'>Guardar</button>
    </form>
  )
}
