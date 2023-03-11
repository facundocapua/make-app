import { ImageResponse } from '@vercel/og'
import type { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge'
}

export default function (req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const day = searchParams.get('day') || '00/00'
  const time = searchParams.get('time') || '00:00'
  const balance = searchParams.get('balance') || '0.00'

  return new ImageResponse(
    (
      <div style={{ display: 'flex' }}>
        <img
          width="1284"
          height="1275"
          src="https://www.makeapp.ar/bg_date.jpg"
        />
        <div style={{
          display: 'flex',
          position: 'absolute',
          top: '360px',
          left: '650px',
          fontSize: 50,
          color: 'white'
        }}>{day}</div>
        <div style={{
          display: 'flex',
          position: 'absolute',
          top: '500px',
          left: '620px',
          fontSize: 50,
          color: 'white'
        }}>{time}</div>
        <div style={{
          display: 'flex',
          position: 'absolute',
          top: '640px',
          left: '660px',
          fontSize: 50,
          color: 'white'
        }}>${balance}</div>
      </div>
    ),
    {
      width: 1284,
      height: 1275
    }
  )
}
