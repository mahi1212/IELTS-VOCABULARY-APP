import { prisma } from '../db'
import { hash, compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export type RegisterData = {
  email: string
  password: string
  name?: string
  role?: string
}

export type LoginData = {
  email: string
  password: string
}

export const authService = {
  async register(data: RegisterData) {
    const hashedPassword = await hash(data.password, 10)
    
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || 'user'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })

    const token = sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
    return { user, token }
  },

  async login({ email, password }: LoginData) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        createdAt: true
      }
    })

    if (!user) {
      throw new Error('Invalid credentials')
    }

    if (!user.password) {
      throw new Error('Invalid credentials')
    }

    const isValid = await compare(password, user.password)
    if (!isValid) {
      throw new Error('Invalid credentials')
    }

    const token = sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
    
    const { password: _, ...userWithoutPassword } = user
    return {
      user: userWithoutPassword,
      token
    }
  }
} 