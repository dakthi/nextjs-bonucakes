import { NextResponse } from 'next/server';

/**
 * API Helper Functions
 * Common utilities for API route responses and error handling
 */

// Type definitions for API responses
export type ApiResponse<T = any> = {
  data?: T;
  error?: string;
  message?: string;
};

export type ApiError = {
  error: string;
  statusCode: number;
  details?: any;
};

/**
 * Create a successful JSON response
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  message?: string
): NextResponse {
  const response: ApiResponse<T> = { data };
  if (message) response.message = message;

  return NextResponse.json(response, { status });
}

/**
 * Create an error JSON response
 */
export function errorResponse(
  error: string,
  status: number = 500,
  details?: any
): NextResponse {
  const response: ApiResponse = { error };
  if (details) {
    console.error('API Error:', error, details);
  }

  return NextResponse.json(response, { status });
}

/**
 * Handle async API route errors
 */
export async function handleApiError(
  error: unknown,
  context: string = 'API request'
): Promise<NextResponse> {
  console.error(`Error in ${context}:`, error);

  if (error instanceof Error) {
    return errorResponse(error.message, 500, error.stack);
  }

  return errorResponse(`Failed to process ${context}`, 500);
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
  body: Record<string, any>,
  requiredFields: string[]
): { valid: boolean; missing?: string[] } {
  const missing = requiredFields.filter(field => !body[field]);

  if (missing.length > 0) {
    return { valid: false, missing };
  }

  return { valid: true };
}

/**
 * Validate multilingual fields (vi/en)
 */
export function validateMultilingualFields(
  body: Record<string, any>,
  fieldNames: string[]
): { valid: boolean; missing?: string[] } {
  const missing: string[] = [];

  fieldNames.forEach(field => {
    if (!body[`${field}Vi`]) missing.push(`${field}Vi`);
    if (!body[`${field}En`]) missing.push(`${field}En`);
  });

  if (missing.length > 0) {
    return { valid: false, missing };
  }

  return { valid: true };
}

/**
 * Parse and validate integer ID from params
 */
export function parseIntId(id: string): number | null {
  const parsed = parseInt(id, 10);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Create a 404 Not Found response
 */
export function notFoundResponse(resource: string = 'Resource'): NextResponse {
  return errorResponse(`${resource} not found`, 404);
}

/**
 * Create a 400 Bad Request response
 */
export function badRequestResponse(message: string): NextResponse {
  return errorResponse(message, 400);
}

/**
 * Create a 401 Unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return errorResponse(message, 401);
}

/**
 * Create a 403 Forbidden response
 */
export function forbiddenResponse(message: string = 'Forbidden'): NextResponse {
  return errorResponse(message, 403);
}

/**
 * Add cache control headers for public endpoints
 */
export function withCacheHeaders(
  response: NextResponse,
  maxAge: number = 60
): NextResponse {
  response.headers.set('Cache-Control', `public, s-maxage=${maxAge}, stale-while-revalidate`);
  return response;
}

/**
 * Add no-cache headers for dynamic content
 */
export function withNoCacheHeaders(response: NextResponse): NextResponse {
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}

/**
 * Sanitize product data for public API
 * Removes sensitive fields like cost, internal notes, etc.
 */
export function sanitizeProductForPublic(product: any) {
  const { cost, ...sanitized } = product;
  return sanitized;
}

/**
 * Parse query parameters for pagination
 */
export function parsePaginationParams(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;

  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)), // Max 100 items per page
    skip: Math.max(0, skip),
  };
}

/**
 * Create paginated response with metadata
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse {
  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
}
