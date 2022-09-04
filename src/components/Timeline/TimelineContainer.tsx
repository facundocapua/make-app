import React from 'react'

export default function TimelineContainer ({ children }: {children: React.ReactNode}) {
  return (
    <ol className="relative border-l border-red-200 ">
      {children}
    </ol>
  )
}
