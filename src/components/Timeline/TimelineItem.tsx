import React from 'react'

export default function TimelineItem ({ children }: {children: React.ReactNode}) {
  return (
    <li className="mb-10">
      {children}
    </li>
  )
}
