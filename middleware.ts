import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const redirects: Record<string, string> = {
    '/recommendations': '/discover',
    '/validate': '/experiments',
    '/retrospective': '/overview',
    '/learn': '/overview',
  }

  if (redirects[pathname]) {
    const url = request.nextUrl.clone()
    url.pathname = redirects[pathname]
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/recommendations',
    '/validate',
    '/retrospective',
    '/learn',
  ],
}
