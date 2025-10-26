import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { data: generation, error } = await supabaseAdmin
      .from('generations')
      .select(
        'id, status, outputs, error_message, created_at, processing_time_ms'
      )
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (error || !generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      );
    }

    // Calculate progress estimate
    const elapsed = Date.now() - new Date(generation.created_at).getTime();
    const estimatedTotal = 120000; // 2 minutes average
    const progress = Math.min(95, Math.floor((elapsed / estimatedTotal) * 100));

    return NextResponse.json({
      id: generation.id,
      status: generation.status,
      progress:
        generation.status === 'processing'
          ? progress
          : generation.status === 'completed'
            ? 100
            : 0,
      outputs: generation.status === 'completed' ? generation.outputs : null,
      error: generation.error_message,
      processing_time_ms: generation.processing_time_ms,
    });
  } catch (error) {
    console.error('Polling error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
