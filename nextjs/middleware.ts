import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  apiRateLimiter,
  writeRateLimiter,
  authRateLimiter,
  bulkRateLimiter,
  getClientIp,
  createRateLimitResponse,
} from './lib/rate-limit';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip rate limiting for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Get client IP for rate limiting
  const ip = getClientIp(request);
  const identifier = `${ip}:${pathname}`;

  let rateLimitResult;

  // Apply different rate limits based on route
  if (pathname.startsWith('/api/admin/send-bulk-email')) {
    // Strictest limit for bulk operations
    rateLimitResult = await bulkRateLimiter.check(identifier);
  } else if (
    pathname.match(/\/api\/products\/[^/]+\/reviews$/) && request.method === 'POST' ||
    pathname === '/api/orders' && request.method === 'POST'
  ) {
    // Strict limit for write operations (reviews, orders)
    rateLimitResult = await writeRateLimiter.check(identifier);
  } else if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/admin')
  ) {
    // Moderate limit for auth and admin operations
    rateLimitResult = await authRateLimiter.check(identifier);
  } else if (pathname.startsWith('/api/')) {
    // General API rate limit
    rateLimitResult = await apiRateLimiter.check(identifier);
  } else {
    // No rate limiting for non-API routes
    rateLimitResult = { success: true, remaining: 60, reset: Date.now() + 60000 };
  }

  // Check rate limit
  if (!rateLimitResult.success) {
    console.warn(`[Rate Limit] Blocked request from ${ip} to ${pathname}`);
    return createRateLimitResponse(rateLimitResult.reset);
  }

  // Create response with security headers
  const response = NextResponse.next();

  // Add security headers
  const securityHeaders = {
    // Prevent clickjacking
    'X-Frame-Options': 'SAMEORIGIN',
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    // Enable XSS protection
    'X-XSS-Protection': '1; mode=block',
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Permissions policy (restrict features)
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    // Content Security Policy (adjust as needed for your app)
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://maps.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.stripe.com https://maps.googleapis.com",
      "frame-src 'self' https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; '),
  };

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add rate limit headers
  if (pathname.startsWith('/api/')) {
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.reset).toISOString());
  }

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
