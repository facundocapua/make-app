const picturesOrigin = process.env.CLOUDFLARE_R2_PUBLIC_URL ?? ''

// A new external origin must be added here, or the browser blocks it
const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js inlines the scripts and styles that hydrate the page
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  // authjs.dev serves the Google logo on the NextAuth sign-in page
  `img-src 'self' data: blob: https://authjs.dev ${picturesOrigin}`,
  // Pictures are uploaded straight to R2 with a presigned URL
  "connect-src 'self' https://*.r2.cloudflarestorage.com",
  "font-src 'self'",
  // Signing in posts to NextAuth, which redirects to Google
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
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
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
