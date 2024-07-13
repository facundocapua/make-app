import type { ReactNode } from 'react'
import '../styles/globals.css'
import Providers from './providers'
import Main from '@/components/Layout/Main'
import { FlashToaster } from '@/components/toaster/toaster'

export default function RootLayout ({
  children
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Main>
            {children}
          </Main>
          <FlashToaster />
        </Providers>
      </body>
    </html>
  )
}
