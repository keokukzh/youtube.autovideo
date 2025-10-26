/**
 * Worker process handler for Cloudflare Workers
 * Handles background processing of content generation
 */

import { createSupabaseAdminClient } from '../utils/supabase';
import { createOpenAIClient, createContentPrompts } from '../utils/openai';
import { successResponse, errorResponse } from '../utils/response';
import type { RequestContext } from '../types';

export async function handleWorkerProcess(
  context: RequestContext
): Promise<Response> {
  const { request, env } = context;

  try {
    // Verify this is a legitimate worker request
    const authHeader = request.headers.get('Authorization');
    const expectedSecret = env.CRON_SECRET;

    if (authHeader !== `Bearer ${expectedSecret}`) {
      return errorResponse('Unauthorized worker request', 401);
    }

    const supabase = createSupabaseAdminClient(env);
    const openai = createOpenAIClient(env);

    // Get pending generations
    const { data: generations, error } = await supabase
      .from('generations')
      .select('*')
      .eq('status', 'pending')
      .order('scheduled_at', { ascending: true })
      .limit(5);

    if (error) {
      return errorResponse('Failed to fetch pending generations', 500);
    }

    if (!generations || generations.length === 0) {
      return successResponse({ message: 'No pending generations' });
    }

    const results = [];

    for (const generation of generations) {
      try {
        // Update status to processing
        await supabase
          .from('generations')
          .update({ status: 'processing' })
          .eq('id', generation.id);

        let transcript = generation.transcript;

        // Process based on input type
        if (generation.input_type === 'youtube_url' && generation.input_url) {
          // TODO: Implement YouTube transcript extraction
          // For now, we'll use a placeholder
          transcript = `YouTube video transcript for ${generation.input_url}`;
        } else if (
          generation.input_type === 'audio_file' &&
          generation.input_url
        ) {
          // TODO: Implement audio transcription
          // For now, we'll use a placeholder
          transcript = `Audio transcript for ${generation.input_url}`;
        }

        if (!transcript) {
          throw new Error('No transcript available');
        }

        // Generate content using OpenAI
        const prompts = createContentPrompts(transcript);
        const outputs: Record<string, any> = {};

        // Generate all content types
        const contentTypes = [
          'twitter',
          'linkedin',
          'instagram',
          'blog',
          'email',
          'quotes',
          'thread',
          'podcast',
          'summary',
          'hooks',
        ];

        for (const contentType of contentTypes) {
          try {
            const prompt = prompts[contentType as keyof typeof prompts];
            const content = await openai.chat.completions.create({
              model: 'gpt-4',
              messages: [
                {
                  role: 'system',
                  content:
                    'You are a content repurposing expert. Generate high-quality, engaging content based on the provided input.',
                },
                {
                  role: 'user',
                  content: prompt,
                },
              ],
              max_tokens: 2000,
              temperature: 0.7,
            });

            outputs[contentType] = content.choices[0]?.message?.content || '';
          } catch (error) {
            console.error(`Error generating ${contentType}:`, error);
            outputs[contentType] = `Error generating ${contentType}`;
          }
        }

        // Update generation with outputs
        await supabase
          .from('generations')
          .update({
            status: 'completed',
            outputs: outputs,
            transcript: transcript,
            completed_at: new Date().toISOString(),
          })
          .eq('id', generation.id);

        results.push({ id: generation.id, status: 'completed' });
      } catch (error) {
        console.error(`Error processing generation ${generation.id}:`, error);

        // Mark as failed
        await supabase
          .from('generations')
          .update({
            status: 'failed',
            error_message:
              error instanceof Error ? error.message : 'Unknown error',
            completed_at: new Date().toISOString(),
          })
          .eq('id', generation.id);

        results.push({ id: generation.id, status: 'failed' });
      }
    }

    return successResponse({
      message: `Processed ${results.length} generations`,
      results,
    });
  } catch (error: any) {
    console.error('Worker process error:', error);
    return errorResponse(error.message, 500);
  }
}
