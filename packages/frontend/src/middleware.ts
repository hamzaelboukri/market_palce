import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * With Auth0 React SDK, authentication is handled client-side.
 * Route protection is done in the page components (e.g., redirect to /login when not authenticated).
 * This middleware allows all requests - remove the nextjs-auth0 middleware.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/seller/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};
