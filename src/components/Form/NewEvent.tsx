import React, { useContext, useState } from 'react'
import Text from './Elements/Text'
import { AlertsContext, AlertsContextType } from '@/context/alerts'
import { AlertType } from '@/types/alerts'
import { useRouter } from 'next/router'

export default function NewEvent () {
  const [fullName, setFullName] = useState('')
  const [date, setDate] = useState('')
  const { addAlert } = useContext(AlertsContext) as AlertsContextType
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = { fullName, date }
    fetch('/api/saveEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
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
    <form onSubmit={handleSubmit} className='flex flex-col bg-rose-200 mx-4 p-2 rounded-lg content-center justify-center'>
      <Text
        placeholder="Nombre"
        value={fullName}
        onChange={setFullName}
      />
      <Text
        placeholder="Fecha"
        value={date}
        onChange={setDate}
        type='datetime-local'
      />

      <button type='submit' className='p-2 bg-rose-300 mx-2 border-2 border-rose-400 rounded-xl hover:bg-rose-400 hover:text-rose-100'>Guardar</button>
    </form>
  )
}
