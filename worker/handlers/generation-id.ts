/**
 * Get generation by ID handler for Cloudflare Workers
 */

import { createSupabaseAdminClient, getCurrentUser } from '../utils/supabase';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from '../utils/response';
import type { RequestContext } from '../types';

export async function handleGenerationById(
  context: RequestContext
): Promise<Response> {
  const { request, env } = context;

  try {
    const user = await getCurrentUser(request, env);
    if (!user) {
      return unauthorizedResponse();
    }

    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const generationId = pathParts[pathParts.length - 1];

    if (!generationId) {
      return errorResponse('Generation ID is required', 400);
    }

    const supabase = createSupabaseAdminClient(env);

    // Get generation
    const { data: generation, error } = await supabase
      .from('generations')
      .select('*')
      .eq('id', generationId)
      .eq('user_id', user.id)
      .single();

    if (error || !generation) {
      return notFoundResponse();
    }

    return successResponse(generation);
  } catch (error: any) {
    console.error('Get generation error:', error);
    return errorResponse(error.message, 500);
  }
}
