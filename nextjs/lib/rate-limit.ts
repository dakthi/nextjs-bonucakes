import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// In-memory rate limiter fallback for development
class InMemoryRateLimiter {
  private requests: Map<string, { count: number; resetAt: number }> = new Map();
  private limit: number;
  private windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  async check(identifier: string): Promise<{ success: boolean; remaining: number; reset: number }> {
    const now = Date.now();
    const record = this.requests.get(identifier);

    // Clean up expired entries periodically
    if (Math.random() < 0.01) {
      const entries = Array.from(this.requests.entries());
      for (const [key, value] of entries) {
        if (value.resetAt < now) {
          this.requests.delete(key);
        }
      }
    }

    if (!record || record.resetAt < now) {
      this.requests.set(identifier, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return { success: true, remaining: this.limit - 1, reset: now + this.windowMs };
    }

    if (record.count >= this.limit) {
      return { success: false, remaining: 0, reset: record.resetAt };
    }

    record.count++;
    return { success: true, remaining: this.limit - record.count, reset: record.resetAt };
  }
}

// Rate limiter configurations
const UPSTASH_REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Wrapper to unify Upstash and in-memory rate limiter interfaces
class RateLimiterWrapper {
  private limiter: any;
  private isUpstash: boolean;

  constructor(limiter: any, isUpstash: boolean) {
    this.limiter = limiter;
    this.isUpstash = isUpstash;
  }

  async check(identifier: string): Promise<{ success: boolean; remaining: number; reset: number }> {
    if (this.isUpstash) {
      const result = await this.limiter.limit(identifier);
      return {
        success: result.success,
        remaining: result.remaining,
        reset: result.reset,
      };
    } else {
      return await this.limiter.check(identifier);
    }
  }
}

// Use Upstash if configured, otherwise use in-memory fallback
const createRateLimiter = (requests: number, window: string) => {
  if (UPSTASH_REDIS_URL && UPSTASH_REDIS_TOKEN) {
    const redis = new Redis({
      url: UPSTASH_REDIS_URL,
      token: UPSTASH_REDIS_TOKEN,
    });

    const upstashLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(requests, window as any),
      analytics: true,
    });

    return new RateLimiterWrapper(upstashLimiter, true);
  }

  // Fallback to in-memory rate limiter
  const windowMs = parseWindow(window);
  const inMemoryLimiter = new InMemoryRateLimiter(requests, windowMs);
  return new RateLimiterWrapper(inMemoryLimiter, false);
};

// Helper to parse window string (e.g., "1 m", "10 s") to milliseconds
function parseWindow(window: string): number {
  const match = window.match(/^(\d+)\s*([smh])$/);
  if (!match) return 60000; // Default 1 minute

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    default:
      return 60000;
  }
}

// Rate limiter for general API requests (60 requests per minute)
export const apiRateLimiter = createRateLimiter(60, '1 m');

// Rate limiter for write operations like reviews, orders (10 requests per minute)
export const writeRateLimiter = createRateLimiter(10, '1 m');

// Rate limiter for auth/sensitive operations (5 requests per minute)
export const authRateLimiter = createRateLimiter(5, '1 m');

// Strict rate limiter for bulk operations (2 requests per minute)
export const bulkRateLimiter = createRateLimiter(2, '1 m');

// Helper function to get client IP
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

// Helper function to create rate limit response
export function createRateLimitResponse(reset: number) {
  const retryAfter = Math.ceil((reset - Date.now()) / 1000);

  return new Response(
    JSON.stringify({
      error: 'Too many requests. Please try again later.',
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': '60',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(reset).toISOString(),
      },
    }
  );
}
