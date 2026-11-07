import Link from 'next/link'

export default function NotFoundPage () {
  return (
    <section className='flex flex-col items-center gap-4 mx-4 text-center text-gray-200'>
      <h2 className='text-xl font-bold'>No encontramos ese turno</h2>
      <p>Puede que se haya eliminado.</p>
      <Link href='/' className='underline'>Volver a los turnos</Link>
    </section>
  )
}
