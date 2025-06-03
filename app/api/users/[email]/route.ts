import { NextResponse } from 'next/server'
import { userService } from '@/lib/services/user-service'

export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    const email = params.email
    const user = await userService.getUserByEmail(email)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    const email = params.email
    const user = await userService.getUserByEmail(email)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    await userService.deleteUser(user.id)
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 