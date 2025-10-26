/**
 * Generate content handler for Cloudflare Workers
 */

import { z } from 'zod';
import { createSupabaseAdminClient, getCurrentUser } from '../utils/supabase';
// OpenAI imports will be used when implementing content generation
// import { createOpenAIClient, createContentPrompts } from '../utils/openai';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  rateLimitResponse,
} from '../utils/response';
import type { RequestContext, GenerateRequest } from '../types';

const generateRequestSchema = z
  .object({
    input_type: z.enum(['youtube_url', 'audio_file', 'text']),
    input_url: z.string().url().optional(),
    input_text: z.string().min(1).optional(),
    output_formats: z.array(z.string()).optional().default([]),
  })
  .refine(
    (data) => {
      if (data.input_type === 'youtube_url' && !data.input_url) {
        return false;
      }
      if (data.input_type === 'text' && !data.input_text) {
        return false;
      }
      return true;
    },
    {
      message:
        'input_url is required for youtube_url type, input_text is required for text type',
    }
  );

export async function handleGenerate(
  context: RequestContext
): Promise<Response> {
  const { request, env } = context;

  try {
    // 1. Verify authentication
    const user = await getCurrentUser(request, env);
    if (!user) {
      return unauthorizedResponse();
    }

    // 2. Check rate limit (simplified for Workers)
    // TODO: Implement proper rate limiting with KV storage
    const rateLimitKey = `rate_limit:${user.id}:generation`;
    const rateLimitData = await env.CACHE.get(rateLimitKey);

    if (rateLimitData) {
      const { count, resetTime } = JSON.parse(rateLimitData);
      if (count >= 10 && Date.now() < resetTime) {
        const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
        return rateLimitResponse(retryAfter);
      }
    }

    // 3. Parse and validate input
    const formData = await request.formData();
    const rawData = {
      input_type: formData.get('input_type'),
      input_url: formData.get('input_url'),
      input_text: formData.get('input_text'),
    };

    let validatedData: GenerateRequest;
    try {
      validatedData = generateRequestSchema.parse(rawData);
    } catch (error) {
      return errorResponse(
        error instanceof z.ZodError
          ? error.errors[0]?.message || 'Invalid input'
          : 'Invalid input',
        400
      );
    }

    const { input_type, input_url, input_text } = validatedData;
    const file = formData.get('file') as File;

    // 4. Create Supabase admin client
    const supabase = createSupabaseAdminClient(env);

    // 5. Deduct credits atomically
    const { data: creditResult } = await supabase.rpc('deduct_credits_atomic', {
      p_user_id: user.id,
      p_amount: 1,
    });

    if (!creditResult?.[0]?.success) {
      return errorResponse(
        creditResult?.[0]?.error_msg || 'Insufficient credits',
        402
      );
    }

    // 6. Create generation record
    const { data: generation, error: createError } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        input_type: input_type,
        input_url: input_url || null,
        status: 'pending',
        scheduled_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError || !generation) {
      return errorResponse('Failed to create generation', 500);
    }

    // 7. For text input, store immediately
    if (input_type === 'text' && input_text) {
      await supabase
        .from('generations')
        .update({ transcript: input_text })
        .eq('id', generation.id);
    }

    // 8. For audio files, upload to Supabase Storage
    if (input_type === 'audio_file' && file) {
      const fileName = `${generation.id}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('audio-uploads')
        .upload(fileName, file);

      if (uploadError) {
        await supabase
          .from('generations')
          .update({ status: 'failed', error_message: 'File upload failed' })
          .eq('id', generation.id);

        return errorResponse('Failed to upload audio file', 500);
      }

      await supabase
        .from('generations')
        .update({ input_url: fileName })
        .eq('id', generation.id);
    }

    // 9. Update rate limit
    const rateLimitCount = rateLimitData
      ? JSON.parse(rateLimitData).count + 1
      : 1;
    const resetTime = Date.now() + 60 * 1000; // 1 minute
    await env.CACHE.put(
      rateLimitKey,
      JSON.stringify({ count: rateLimitCount, resetTime }),
      {
        expirationTtl: 60,
      }
    );

    // 10. Return success response
    return successResponse(
      {
        generation_id: generation.id,
        status: 'pending',
        poll_url: `/api/generation/${generation.id}`,
      },
      'Generation queued successfully'
    );
  } catch (error) {
    console.error('Generate handler error:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Internal server error',
      500
    );
  }
}
