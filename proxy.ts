import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.includes('.') ||
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/setup'
  ) {
    return NextResponse.next()
  }
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
