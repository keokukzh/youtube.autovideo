/**
 * Cron cleanup handler for Cloudflare Workers
 * Cleans up old generations and expired data
 */

import { createSupabaseAdminClient } from '../utils/supabase';
import { successResponse, errorResponse } from '../utils/response';
import type { RequestContext } from '../types';

export async function handleCronCleanup(
  context: RequestContext
): Promise<Response> {
  const { request, env } = context;

  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('Authorization');
    const expectedSecret = env.CRON_SECRET;

    if (authHeader !== `Bearer ${expectedSecret}`) {
      return errorResponse('Unauthorized cron request', 401);
    }

    const supabase = createSupabaseAdminClient(env);

    // Clean up old failed generations (older than 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { error: deleteError } = await supabase
      .from('generations')
      .delete()
      .eq('status', 'failed')
      .lt('created_at', sevenDaysAgo.toISOString());

    if (deleteError) {
      console.error('Error deleting old failed generations:', deleteError);
    }

    // Clean up old completed generations (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { error: deleteCompletedError } = await supabase
      .from('generations')
      .delete()
      .eq('status', 'completed')
      .lt('created_at', thirtyDaysAgo.toISOString());

    if (deleteCompletedError) {
      console.error(
        'Error deleting old completed generations:',
        deleteCompletedError
      );
    }

    // Clean up expired rate limit entries from KV
    // Note: KV entries with TTL will expire automatically, but we can clean up manually if needed
    const rateLimitKeys = await env.CACHE.list({ prefix: 'rate_limit:' });

    for (const key of rateLimitKeys.keys) {
      const data = await env.CACHE.get(key.name);
      if (data) {
        const { resetTime } = JSON.parse(data);
        if (Date.now() > resetTime) {
          await env.CACHE.delete(key.name);
        }
      }
    }

    return successResponse({
      message: 'Cleanup completed successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Cron cleanup error:', error);
    return errorResponse(error.message, 500);
  }
}
