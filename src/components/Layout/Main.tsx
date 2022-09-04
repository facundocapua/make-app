import * as React from 'react'
import { useSession } from 'next-auth/react'
import Login from '@/components/Form/Login'
import MainMenu from '@/components/Menu/MainMenu'
import AlertContainer from '@/components/Ui/AlertContainer'

type MainProps = {
  children: React.ReactNode
}

export default function Main ({ children }: MainProps) {
  const { data: session } = useSession()
  return (
    <div className='w-full h-screen grid content-center justify-center bg-gray-100'>
      <div className='w-screen bg-rose-50 max-w-sm aspect-[9/19.5] rounded-lg flex flex-col relative'>
        <AlertContainer />
        <header className='w-full flex justify-center mt-2'>
          <h1 className='text-2xl mb-4'>MakeApp</h1>
        </header>
        <main className='grow'>
          { session
            ? (
              <>{children}</>
              )
            : (
              <Login />
              )
          }
        </main>
        <footer>
          <MainMenu />
        </footer>
      </div>
    </div>
  )
}
