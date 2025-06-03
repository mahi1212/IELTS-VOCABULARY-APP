import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    
    // Check for admin routes
    if (isAdminRoute && token?.role !== 'admin') {
      return new NextResponse(null, {
        status: 403,
        statusText: "You don't have permission to access this resource",
      })
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

// Protected routes configuration
export const config = {
  matcher: [
    // Auth routes
    '/api/auth/:path*',
    
    // Admin routes
    '/admin/:path*',
    
    // Protected app routes
    '/dashboard/:path*',
    '/profile/:path*',
    '/vocabulary/:path*',
    '/quiz/:path*',
    
    // Exclude auth-related pages
    '/((?!auth|api|_next/static|_next/image|favicon.ico).*)',
  ]
} 