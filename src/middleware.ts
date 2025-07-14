import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { csrfMiddleware } from './middleware/csrf';
import { rateLimitMiddleware } from './middleware/rateLimit';

export async function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Apply rate limiting
  const rateLimitResponse = await rateLimitMiddleware(request);
  if (rateLimitResponse.status !== 200) {
    return rateLimitResponse;
  }

  // Apply CSRF protection
  const csrfResponse = await csrfMiddleware(request);
  if (csrfResponse.status !== 200) {
    return csrfResponse;
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
}; 