/**
 * Worker-specific types for Cloudflare Workers environment
 */

/// <reference types="@cloudflare/workers-types" />

export interface Env {
  // Environment variables (secrets)
  SUPABASE_SERVICE_ROLE_KEY: string;
  OPENAI_API_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_PRICE_ID_STARTER: string;
  STRIPE_PRICE_ID_PRO: string;
  STRIPE_PRICE_ID_TEAM: string;
  CRON_SECRET: string;

  // Public environment variables
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_APP_URL: string;

  // Bindings
  CACHE: KVNamespace;
  FILES: R2Bucket;
}

export interface RequestContext {
  request: Request;
  env: Env;
  ctx: ExecutionContext;
}

export type ApiHandler = (context: RequestContext) => Promise<Response>;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GenerateRequest {
  input_type: 'youtube_url' | 'audio_file' | 'text';
  input_url?: string | undefined;
  input_text?: string | undefined;
  output_formats: string[];
}

export interface GenerationResult {
  id: string;
  user_id: string;
  input_type: string;
  input_url?: string;
  input_text?: string;
  outputs: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  subscription_tier: 'FREE' | 'STARTER' | 'PRO' | 'TEAM';
  created_at: string;
  updated_at: string;
}

export interface Credits {
  user_id: string;
  credits_total: number;
  credits_remaining: number;
  resets_at: string;
  created_at: string;
  updated_at: string;
}

export interface StripeCheckoutSession {
  price_id: string;
  user_id: string;
  tier: string;
}

export interface RateLimitResult {
  success: boolean;
  retryAfter?: number;
  remaining?: number;
  resetTime?: number;
}

export const RATE_LIMITS = {
  GENERATION: {
    requests: 10,
    window: 60, // seconds
  },
  API: {
    requests: 100,
    window: 60, // seconds
  },
} as const;

export const TIER_CREDITS = {
  FREE: 5,
  STARTER: 50,
  PRO: 200,
  TEAM: 500,
} as const;
