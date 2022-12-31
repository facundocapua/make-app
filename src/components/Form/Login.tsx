import { signIn } from 'next-auth/react'
import GoogleIcon from '../Icons/GoogleIcon'

export default function Login () {
  return (
    <div className='grid items-center justify-center w-full h-full'>
      <button className='flex items-center gap-2 px-4 py-2 transition duration-150 ease-in-out bg-rose-200 rounded-2xl hover:bg-rose-300' onClick={() => signIn()}>
        <GoogleIcon className='w-8 h-8' />
        <span className='text-rose-600'>Sign In</span>
      </button>
    </div>
  )
}
