
import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authService } from '@/lib/services/auth-service'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials')
        }
        
        try {
          const result = await authService.login({
            email: credentials.email,
            password: credentials.password,
          })
          
          console.log('Auth result:', result)
          
          return {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
          }
        } catch (error) {
          console.error('Credentials auth error:', error)
          throw new Error('Invalid credentials')
        }
      }
    })
  ],
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT Callback - Input:', { token, user })
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = (user as any).role
      }
      console.log('JWT Callback - Output:', token)
      return token
    },
    async session({ session, token }) {
      console.log('Session Callback - Input:', { session, token })
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
      }
      console.log('Session Callback - Output:', session)
      return session
    }
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
} 