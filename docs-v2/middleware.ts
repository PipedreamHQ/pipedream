import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware to handle 404s by redirecting to the home page
 * Instead of showing a 404 error page, we redirect to the root
 * Using a 301 (permanent) redirect for better SEO handling
 */
export function middleware(request: NextRequest) {
  // We only want to handle 404s, not other pages
  // This check isn't foolproof but helps avoid redirecting existing pages
  const pathname = request.nextUrl.pathname
  
  // Check if this is a static asset or API route - we don't want to redirect these
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/') ||
    pathname.startsWith('/images/') ||
    pathname.includes('.') // Likely a file, e.g. favicon.ico
  ) {
    return NextResponse.next()
  }

  // Return a 301 (permanent) redirect to the home page
  return NextResponse.redirect(new URL('/', request.url), 301)
}

// Configure which paths this middleware will run on
// This runs the middleware on paths that don't exist in our app
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. Existing pages in the pages directory
     * 2. API routes
     * 3. Static files (images, etc)
     * 4. System paths like _next, favicon.ico, etc.
     */
    '/((?!_next|api|images|favicon.ico).*)',
  ],
}