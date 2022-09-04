import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { HomeIcon, AddIcon, ExitIcon } from '@/components/Icons'

export default function MainMenu () {
  return (
    <nav className='flex justify-center items-center gap-10 pb-4'>
      <Link href="/">
        <a>
          <HomeIcon className='h-8 w-8 transition-transform text-rose-500 hover:scale-125' />
        </a>
      </Link>
      <Link href="/create">
        <a>
          <AddIcon className='h-12 w-12 transition-transform bg-rose-500 rounded-full text-white hover:scale-125' />
        </a>
      </Link>
      <button aria-label='Sign Out' title='Sign Out' onClick={() => signOut()}>
        <ExitIcon className='h-8 w-8  transition-transform text-rose-500 hover:scale-125' />
      </button>
    </nav>
  )
}
