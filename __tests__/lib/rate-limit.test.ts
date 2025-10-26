import {
  checkRateLimit,
  checkUserRateLimit,
  RATE_LIMITS,
  getRateLimitHeaders,
  rateLimitStore,
} from '@/lib/rate-limit';
import { NextRequest } from 'next/server';

// Mock NextRequest
const createMockRequest = (ip?: string, userAgent?: string): NextRequest => {
  const headers = new Headers();
  if (userAgent) headers.set('user-agent', userAgent);
  if (ip) headers.set('x-forwarded-for', ip);

  return {
    ip: ip || '127.0.0.1',
    headers,
  } as NextRequest;
};

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Clear any existing rate limit data
    jest.clearAllMocks();
    // Clear the rate limit store
    rateLimitStore.clear();
  });

  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const request = createMockRequest('127.0.0.1', 'test-agent');
      const result = checkRateLimit(request, RATE_LIMITS.API);

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(RATE_LIMITS.API.maxRequests - 1);
      expect(result.limit).toBe(RATE_LIMITS.API.maxRequests);
    });

    it('should track multiple requests from same IP', () => {
      const request = createMockRequest('127.0.0.1', 'test-agent');

      // First request
      const result1 = checkRateLimit(request, RATE_LIMITS.API);
      expect(result1.success).toBe(true);
      expect(result1.remaining).toBe(RATE_LIMITS.API.maxRequests - 1);

      // Second request
      const result2 = checkRateLimit(request, RATE_LIMITS.API);
      expect(result2.success).toBe(true);
      expect(result2.remaining).toBe(RATE_LIMITS.API.maxRequests - 2);
    });

    it('should block requests when limit exceeded', () => {
      const request = createMockRequest('127.0.0.1', 'test-agent');
      const config = { windowMs: 60000, maxRequests: 2 }; // 2 requests per minute

      // First request
      const result1 = checkRateLimit(request, config);
      expect(result1.success).toBe(true);

      // Second request
      const result2 = checkRateLimit(request, config);
      expect(result2.success).toBe(true);

      // Third request should be blocked
      const result3 = checkRateLimit(request, config);
      expect(result3.success).toBe(false);
      expect(result3.remaining).toBe(0);
      expect(result3.retryAfter).toBeDefined();
    });

    it('should handle different IPs separately', () => {
      const request1 = createMockRequest('127.0.0.1', 'test-agent');
      const request2 = createMockRequest('127.0.0.2', 'test-agent');
      const config = { windowMs: 60000, maxRequests: 1 };

      // First IP
      const result1 = checkRateLimit(request1, config);
      expect(result1.success).toBe(true);

      // Second IP should also be allowed
      const result2 = checkRateLimit(request2, config);
      expect(result2.success).toBe(true);
    });

    it('should handle different user agents separately', () => {
      const request1 = createMockRequest('127.0.0.1', 'agent1');
      const request2 = createMockRequest('127.0.0.1', 'agent2');
      const config = { windowMs: 60000, maxRequests: 1 };

      // First agent
      const result1 = checkRateLimit(request1, config);
      expect(result1.success).toBe(true);

      // Second agent should also be allowed
      const result2 = checkRateLimit(request2, config);
      expect(result2.success).toBe(true);
    });
  });

  describe('checkUserRateLimit', () => {
    it('should allow first request for user', () => {
      const result = checkUserRateLimit('user1', RATE_LIMITS.GENERATION);

      expect(result.success).toBe(true);
      expect(result.remaining).toBe(RATE_LIMITS.GENERATION.maxRequests - 1);
      expect(result.limit).toBe(RATE_LIMITS.GENERATION.maxRequests);
    });

    it('should track multiple requests from same user', () => {
      const userId = 'user1';

      // First request
      const result1 = checkUserRateLimit(userId, RATE_LIMITS.GENERATION);
      expect(result1.success).toBe(true);
      expect(result1.remaining).toBe(RATE_LIMITS.GENERATION.maxRequests - 1);

      // Second request
      const result2 = checkUserRateLimit(userId, RATE_LIMITS.GENERATION);
      expect(result2.success).toBe(true);
      expect(result2.remaining).toBe(RATE_LIMITS.GENERATION.maxRequests - 2);
    });

    it('should block requests when user limit exceeded', () => {
      const userId = 'user1';
      const config = { windowMs: 60000, maxRequests: 2 };

      // First request
      const result1 = checkUserRateLimit(userId, config);
      expect(result1.success).toBe(true);

      // Second request
      const result2 = checkUserRateLimit(userId, config);
      expect(result2.success).toBe(true);

      // Third request should be blocked
      const result3 = checkUserRateLimit(userId, config);
      expect(result3.success).toBe(false);
      expect(result3.remaining).toBe(0);
      expect(result3.retryAfter).toBeDefined();
    });

    it('should handle different users separately', () => {
      const config = { windowMs: 60000, maxRequests: 1 };

      // First user
      const result1 = checkUserRateLimit('user1', config);
      expect(result1.success).toBe(true);

      // Second user should also be allowed
      const result2 = checkUserRateLimit('user2', config);
      expect(result2.success).toBe(true);
    });
  });

  describe('RATE_LIMITS', () => {
    it('should have correct limits for different endpoints', () => {
      expect(RATE_LIMITS.GENERATION.maxRequests).toBe(10);
      expect(RATE_LIMITS.GENERATION.windowMs).toBe(15 * 60 * 1000);

      expect(RATE_LIMITS.API.maxRequests).toBe(100);
      expect(RATE_LIMITS.API.windowMs).toBe(15 * 60 * 1000);

      expect(RATE_LIMITS.AUTH.maxRequests).toBe(20);
      expect(RATE_LIMITS.AUTH.windowMs).toBe(15 * 60 * 1000);

      expect(RATE_LIMITS.WORKER.maxRequests).toBe(60);
      expect(RATE_LIMITS.WORKER.windowMs).toBe(60 * 1000);
    });
  });

  describe('getRateLimitHeaders', () => {
    it('should return correct headers', () => {
      const result = {
        success: true,
        limit: 10,
        remaining: 5,
        resetTime: 1234567890,
      };

      const headers = getRateLimitHeaders(result);

      expect(headers['X-RateLimit-Limit']).toBe('10');
      expect(headers['X-RateLimit-Remaining']).toBe('5');
      expect(headers['X-RateLimit-Reset']).toBe('1234567890');
    });
  });
});
