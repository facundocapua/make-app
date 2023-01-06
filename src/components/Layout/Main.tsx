import { ReactNode, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Login from '@/components/Form/Login'
import MainMenu from '@/components/Menu/MainMenu'
import AlertContainer from '@/components/Ui/AlertContainer'

type MainProps = {
  children: ReactNode
}

export default function Main ({ children }: MainProps) {
  const { data: session } = useSession()

  useEffect(() => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }, [])

  return (
    <div className='grid content-center justify-center w-full bg-gray-300'>
      <div className='relative flex flex-col w-screen h-screen max-w-md bg-rose-50'>
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
