import React from 'react'

type Props = {
  children: React.ReactNode
  onClick: (e: React.MouseEvent<HTMLElement>) => void
  className?: string
}

export default function Button ({ children, onClick, className }: Props) {
  return (
    <button onClick={onClick} className={`px-4 py-2 bg-rose-400 rounded-lg ${className}`}>{children}</button>
  )
}
