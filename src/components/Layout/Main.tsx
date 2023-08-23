'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import MainMenu from '@/components/Menu/MainMenu'
import AlertContainer from '@/components/Ui/AlertContainer'
import Image from 'next/image'

type MainProps = {
  children: ReactNode
}

export default function Main ({ children }: MainProps) {
  useEffect(() => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }, [])

  return (
    <div className='grid content-center justify-center w-full bg-gray-300'>
      <div className='relative flex flex-col w-screen h-screen max-w-md bg-black'>
        <AlertContainer />
        <header className='flex items-center justify-center w-full py-4'>
          <h1 className='text-2xl'>
            <Image src='/logo.png' alt='MakeApp' width={150} height={50} />
          </h1>
        </header>
        <main className='min-h-0 overflow-y-auto grow shrink basis-0'>
          {children}
        </main>
        <footer>
          <MainMenu />
          <div className='flex items-center justify-center w-full pb-2 text-xs text-white'>
            <a href="https://makeapp.ar/privacy-policy" target='_blank' rel="external nofollow noopener noreferrer">Privacy Policy</a>
          </div>
        </footer>
      </div>
    </div>
  )
}
