import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Authentication Middleware for API Routes
 * Verifies user authentication and authorization
 */

/**
 * Check if the request is authenticated and has admin role
 */
export async function checkAuth(request: NextRequest): Promise<boolean> {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // Check if token exists and user has admin role
    return token?.role === 'admin';
  } catch (error) {
    console.error('Check auth error:', error);
    return false;
  }
}

/**
 * Wrapper function to protect API routes with authentication
 * Usage: return withAuth(request, async (req) => { ... })
 */
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    return handler(request);
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 401 }
    );
  }
}

/**
 * Get current user from token
 */
export async function getCurrentUser(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    return token || null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Check if user has specific permission
 */
export async function checkPermission(
  request: NextRequest,
  requiredPermission: string
): Promise<boolean> {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // For now, simple role-based check
    // Can be extended to check specific permissions from database
    if (!token) return false;

    // Admin has all permissions
    if (token.role === 'admin') return true;

    // Add more granular permission checks here if needed
    return false;
  } catch (error) {
    console.error('Check permission error:', error);
    return false;
  }
}
