'use client'

import { useEffect } from 'react'

type Props = {
  error: Error
  reset: () => void
}

export default function ErrorPage ({ error, reset }: Props) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className='flex flex-col items-center gap-4 mx-4 text-center text-gray-200'>
      <h2 className='text-xl font-bold'>No pudimos cargar la información</h2>
      <p>Tus turnos no se perdieron. Revisá tu conexión e intentá de nuevo.</p>
      <button
        type='button'
        onClick={reset}
        className='p-2 text-gray-100 bg-gray-700 border-2 border-gray-400 rounded-xl hover:bg-gray-300 hover:text-gray-700'
      >
        Reintentar
      </button>
    </section>
  )
}
