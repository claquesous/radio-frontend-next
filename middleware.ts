import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Enforce authentication for all /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const jwt = request.cookies.get('jwt')
    if (!jwt) {
      // Redirect to root page if not authenticated
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  return NextResponse.next()
}

// Optionally, specify which paths to match
export const config = {
  matcher: ['/admin/:path*'],
}
