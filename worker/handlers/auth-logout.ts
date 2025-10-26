/**
 * Auth logout handler for Cloudflare Workers
 */

import { createSupabaseClient, getCurrentUser } from '../utils/supabase';
import { successResponse, unauthorizedResponse } from '../utils/response';
import type { RequestContext } from '../types';

export async function handleAuthLogout(
  context: RequestContext
): Promise<Response> {
  const { request, env } = context;

  try {
    const user = await getCurrentUser(request, env);
    if (!user) {
      return unauthorizedResponse();
    }

    const supabase = createSupabaseClient(env);

    // Sign out the user
    await supabase.auth.signOut();

    return successResponse({ message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout error:', error);
    return successResponse({ message: 'Logged out successfully' });
  }
}
