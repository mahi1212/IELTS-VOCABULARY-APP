import { NextResponse } from 'next/server'
import { authService } from '@/lib/services/auth-service'
import { Prisma } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const result = await authService.register({ email, password, name })
    
    return NextResponse.json({
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name
      }
    })

  } catch (error) {
    console.error('Registration error:', error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle unique constraint violation
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }
    }

    // Handle other specific errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
} 