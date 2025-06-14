import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

async function validateGoogleToken (token: string): Promise<boolean> {
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`)
    return response.ok
  } catch (error) {
    return false
  }
}

export const GET = async (req: NextRequest) => {
  const searchParas = req.nextUrl.searchParams
  const token = searchParas.get('token') ?? ''

  console.log('GET /api/client-data', token)

  if (!token) {
    return NextResponse.json(
      { error: 'Missing token' },
      { status: 400 }
    )
  }

  const isValidToken = await validateGoogleToken(token)
  if (!isValidToken) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }

  const bucketData = {
    region: 'auto',
    signatureVersion: 'v4',
    endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY ?? '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY ?? '',
    bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME ?? '',
    publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL ?? ''
  }

  return NextResponse.json(bucketData)
}
