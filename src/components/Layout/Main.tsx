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
    <div className='grid content-center justify-center w-full h-screen bg-gray-300'>
      <div className='w-screen max-w-md bg-rose-50 aspect-[9/19.5] flex flex-col relative'>
        <AlertContainer />
        <header className='flex items-center justify-center w-full py-4'>
          <h1 className='text-2xl'>MakeApp</h1>
        </header>
        <main className='min-h-0 overflow-y-auto grow shrink basis-0'>
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
