import { NextRequest } from 'next/server';

/**
 * In-memory rate limiting store
 * In production, consider using Redis or Upstash for distributed rate limiting
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string; // Custom key generator
}

/**
 * Default rate limit configurations
 */
export const RATE_LIMITS = {
  // Strict limits for generation endpoint
  GENERATION: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10, // 10 requests per 15 minutes
  },
  // Moderate limits for general API usage
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
  },
  // Lenient limits for authentication
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 20, // 20 requests per 15 minutes
  },
  // Very strict limits for worker endpoints
  WORKER: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  },
} as const;

/**
 * Generate a rate limit key for a request
 */
function generateKey(
  req: NextRequest,
  customKeyGenerator?: (req: NextRequest) => string
): string {
  if (customKeyGenerator) {
    return customKeyGenerator(req);
  }

  // Default: use IP address + user agent for basic fingerprinting
  const ip =
    req.ip ||
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';

  // Create a simple hash of IP + User Agent
  const combined = `${ip}-${userAgent}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return `rate_limit:${Math.abs(hash)}`;
}

/**
 * Clean up expired entries from the rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];

  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach((key) => rateLimitStore.delete(key));
}

/**
 * Rate limiting result
 */
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number; // Seconds to wait before retrying
}

/**
 * Check if a request is within rate limits
 *
 * @param req - Next.js request object
 * @param config - Rate limiting configuration
 * @returns Rate limit result with success status and metadata
 *
 * @example
 * ```typescript
 * const result = checkRateLimit(request, RATE_LIMITS.API);
 * if (!result.success) {
 *   return new Response('Rate limit exceeded', { status: 429 });
 * }
 * ```
 */
export function checkRateLimit(
  req: NextRequest,
  config: RateLimitConfig
): RateLimitResult {
  const key = generateKey(req, config.keyGenerator);
  const now = Date.now();

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    // 1% chance
    cleanupExpiredEntries();
  }

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // First request or window has expired
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, newEntry);

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  if (entry.count >= config.maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter,
    };
  }

  // Increment counter
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Rate limiting middleware for API routes
 */
export function withRateLimit(config: RateLimitConfig) {
  return function rateLimitMiddleware(req: NextRequest) {
    const result = checkRateLimit(req, config);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          retryAfter: result.retryAfter,
          limit: result.limit,
          remaining: result.remaining,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toString(),
            'Retry-After': result.retryAfter?.toString() || '0',
          },
        }
      );
    }

    return null; // No rate limit exceeded, continue
  };
}

/**
 * Get rate limit headers for successful requests
 */
export function getRateLimitHeaders(
  result: RateLimitResult
): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetTime.toString(),
  };
}

/**
 * User-specific rate limiting (requires authentication)
 */
export function checkUserRateLimit(
  userId: string,
  config: RateLimitConfig
): RateLimitResult {
  const key = `user:${userId}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, newEntry);

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  if (entry.count >= config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter,
    };
  }

  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}
