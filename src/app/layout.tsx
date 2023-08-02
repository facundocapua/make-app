import type { ReactNode } from 'react'
import '../styles/globals.css'
import Providers from './providers'
import Main from '@/components/Layout/Main'

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
        </Providers>
      </body>
    </html>
  )
}
