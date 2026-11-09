import NextAuth from 'next-auth'
import { browserAuthOptions } from '@/utils/auth-options'

const handler = NextAuth(browserAuthOptions)

export { handler as GET, handler as POST }
