import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  generateRequestSchema,
  validateRequest,
  type GenerateRequest,
} from '@/lib/validation';
import {
  checkUserRateLimit,
  RATE_LIMITS,
  getRateLimitHeaders,
} from '@/lib/rate-limit';
import type { ApiResponse } from '@/lib/types';

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    // 1. Verify authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 2. Check rate limit
    const rateLimitResult = checkUserRateLimit(user.id, RATE_LIMITS.GENERATION);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit exceeded. Try again in ${rateLimitResult.retryAfter} seconds.`,
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }

    // 3. Parse and validate input
    const formData = await request.formData();
    const rawData = {
      input_type: formData.get('input_type'),
      input_url: formData.get('input_url'),
      input_text: formData.get('input_text'),
    };

    // Validate input using Zod schema
    let validatedData: GenerateRequest;
    try {
      validatedData = validateRequest(generateRequestSchema, rawData);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Invalid input',
        },
        { status: 400 }
      );
    }

    const { input_type, input_url, input_text } = validatedData;
    const file = formData.get('file') as File;

    // 5. Deduct credits atomically (FIX RACE CONDITION)
    const { data: creditResult } = await supabaseAdmin.rpc(
      'deduct_credits_atomic',
      {
        p_user_id: user.id,
        p_amount: 1,
      }
    );

    if (!creditResult?.[0]?.success) {
      return NextResponse.json(
        {
          success: false,
          error: creditResult?.[0]?.error_msg || 'Insufficient credits',
        },
        { status: 402 }
      );
    }

    // 6. Create generation record (job queue entry)
    const { data: generation, error: createError } = await supabaseAdmin
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
      return NextResponse.json(
        { success: false, error: 'Failed to create generation' },
        { status: 500 }
      );
    }

    // 7. For text/youtube, store input immediately
    if (input_type === 'text' && input_text) {
      await supabaseAdmin
        .from('generations')
        .update({ transcript: input_text })
        .eq('id', generation.id);
    }

    // 8. For audio files, upload to Supabase Storage (FREE)
    if (input_type === 'audio' && file) {
      const fileName = `${generation.id}/${file.name}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from('audio-uploads')
        .upload(fileName, file);

      if (uploadError) {
        await supabaseAdmin
          .from('generations')
          .update({ status: 'failed', error_message: 'File upload failed' })
          .eq('id', generation.id);

        return NextResponse.json(
          { success: false, error: 'Failed to upload audio file' },
          { status: 500 }
        );
      }

      await supabaseAdmin
        .from('generations')
        .update({ input_url: fileName })
        .eq('id', generation.id);
    }

    // 9. Return immediately (job will be processed by worker)
    return NextResponse.json(
      {
        success: true,
        data: {
          generation_id: generation.id,
          status: 'pending',
          poll_url: `/api/generation/${generation.id}`,
        },
        message: 'Generation queued successfully',
      },
      {
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  } catch (error) {
    console.error('API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
