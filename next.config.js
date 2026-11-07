const picturesOrigin = process.env.CLOUDFLARE_R2_PUBLIC_URL ?? ''

// Safe to enforce, because they can't affect how the app itself loads
const enforcedPolicy = [
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'"
].join('; ')

// Only reports violations in the browser console for now, so a missing origin can't break sign-in or uploads
const reportedPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  // authjs.dev serves the Google logo on the NextAuth sign-in page
  `img-src 'self' data: blob: https://authjs.dev ${picturesOrigin}`,
  "connect-src 'self' https://*.r2.cloudflarestorage.com",
  "font-src 'self'",
  "form-action 'self' https://accounts.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'"
].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers () {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: enforcedPolicy },
          { key: 'Content-Security-Policy-Report-Only', value: reportedPolicy },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' }
        ]
      }
    ]
  }
}

module.exports = nextConfig
