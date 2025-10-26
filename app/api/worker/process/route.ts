import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getTranscriptWithCache } from '@/lib/transcription';
import { generateAllContent } from '@/lib/openai';
// import type { ContentOutputs } from '@/lib/types';

// This endpoint is called by:
// 1. Vercel Cron (every minute) - FREE on Hobby plan
// 2. Client-side polling trigger (fallback)
export async function POST(request: NextRequest) {
  try {
    // Security: Verify cron secret or internal call
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get next pending job (atomic, no race conditions)
    const { data: jobs } = await supabaseAdmin.rpc('get_next_pending_job');

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ message: 'No pending jobs' });
    }

    const job = jobs[0];
    if (!job) {
      return NextResponse.json({ message: 'No pending jobs' });
    }
    const startTime = Date.now();

    try {
      // 1. Get transcript (with caching)
      let transcript = job.transcript;

      if (!transcript) {
        if (job.input_type === 'youtube' && job.input_url) {
          transcript = await getTranscriptWithCache('youtube', job.input_url);
        } else if (job.input_type === 'audio' && job.input_url) {
          // Download from Supabase Storage
          const { data: fileData } = await supabaseAdmin.storage
            .from('audio-uploads')
            .download(job.input_url);

          if (fileData) {
            const buffer = Buffer.from(await fileData.arrayBuffer());
            const { transcribeAudio } = await import('@/lib/openai');
            transcript = await transcribeAudio(buffer, 'audio.mp3');
          }
        }

        // Save transcript
        await supabaseAdmin
          .from('generations')
          .update({ transcript })
          .eq('id', job.job_id);
      }

      // 2. Generate all content
      const outputs = await generateAllContent(transcript);

      // 3. Mark as completed
      const processingTime = Date.now() - startTime;
      await supabaseAdmin
        .from('generations')
        .update({
          outputs: outputs as any,
          status: 'completed',
          completed_at: new Date().toISOString(),
          processing_time_ms: processingTime,
        })
        .eq('id', job.job_id);

      return NextResponse.json({
        success: true,
        job_id: job.job_id,
        processing_time_ms: processingTime,
      });
    } catch (error) {
      console.error('Job processing error:', error);

      // Update job with error and retry logic
      const { data: currentJob } = await supabaseAdmin
        .from('generations')
        .select('retry_count, max_retries')
        .eq('id', job.job_id)
        .single();

      const retryCount = (currentJob?.retry_count || 0) + 1;
      const shouldRetry = retryCount < (currentJob?.max_retries || 3);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      const updateData: any = {
        status: shouldRetry ? 'pending' : 'failed',
        error_message: errorMessage,
        retry_count: retryCount,
      };
      
      if (shouldRetry) {
        updateData.scheduled_at = new Date(Date.now() + 60000 * retryCount).toISOString();
      }

      await supabaseAdmin
        .from('generations')
        .update(updateData)
        .eq('id', job.job_id);

      return NextResponse.json({
        success: false,
        job_id: job.job_id,
        error: errorMessage,
        will_retry: shouldRetry,
      });
    }
  } catch (error) {
    console.error('Worker error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Worker failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
