import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { HomeIcon, AddIcon, ExitIcon } from '@/components/Icons'

export default function MainMenu () {
  return (
    <nav className='flex items-center justify-center gap-10 py-4'>
      <Link href="/">
        <HomeIcon className='w-8 h-8 text-white transition-transform hover:scale-125' />
      </Link>
      <Link href="/create">
        <AddIcon className='w-12 h-12 text-gray-700 transition-transform bg-white rounded-full hover:scale-125' />
      </Link>
      <button aria-label='Sign Out' title='Sign Out' onClick={() => signOut()}>
        <ExitIcon className='w-8 h-8 text-white transition-transform hover:scale-125' />
      </button>
    </nav>
  )
}
