/**
 * Supabase client for Cloudflare Workers
 */

import { createClient } from '@supabase/supabase-js';
import type { Env } from '../types';

export function createSupabaseClient(env: Env) {
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function createSupabaseAdminClient(env: Env) {
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function getCurrentUser(request: Request, env: Env) {
  const supabase = createSupabaseClient(env);

  // Extract auth token from Authorization header or cookies
  const authHeader = request.headers.get('Authorization');
  const token =
    authHeader?.replace('Bearer ', '') ||
    request.headers.get('Cookie')?.match(/sb-[^=]+-auth-token=([^;]+)/)?.[1];

  if (!token) {
    return null;
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function verifyWebhookSignature(
  request: Request,
  env: Env,
  secret: string
): Promise<boolean> {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return false;
  }

  // For Stripe webhooks, we'll handle this in the Stripe handler
  // This is a placeholder for other webhook verification
  return true;
}
