import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Client-side Supabase client
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Admin Supabase client (bypasses RLS)
 */
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Get user profile from database
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

/**
 * Get user credits
 */
export async function getUserCredits(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('credits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user credits:', error);
    return null;
  }

  return data;
}

/**
 * Deduct credits atomically
 */
export async function deductCredits(userId: string, amount: number = 1) {
  // First get current credits
  const { data: currentCredits, error: fetchError } = await supabaseAdmin
    .from('credits')
    .select('credits_remaining')
    .eq('user_id', userId)
    .single();

  if (fetchError || !currentCredits) {
    return {
      success: false,
      error: fetchError?.message || 'Credits not found',
    };
  }

  if (currentCredits.credits_remaining < amount) {
    return { success: false, error: 'Insufficient credits' };
  }

  // Update credits
  const { data, error } = await supabaseAdmin
    .from('credits')
    .update({
      credits_remaining: currentCredits.credits_remaining - amount,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error deducting credits:', error);
    return { success: false, error: error.message };
  }

  if (!data) {
    return { success: false, error: 'Insufficient credits' };
  }

  return { success: true, data };
}

/**
 * Create user profile and initial credits
 */
export async function createUserProfile(userId: string, email: string) {
  try {
    // Create user profile
    const { error: userError } = await supabaseAdmin.from('users').insert({
      id: userId,
      email,
      subscription_tier: 'FREE',
    });

    if (userError) {
      console.error('Error creating user profile:', userError);
      return { success: false, error: userError.message };
    }

    // Create initial credits
    const { error: creditsError } = await supabaseAdmin.from('credits').insert({
      user_id: userId,
      credits_remaining: 5,
      credits_total: 5,
      resets_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    });

    if (creditsError) {
      console.error('Error creating user credits:', creditsError);
      return { success: false, error: creditsError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    return { success: false, error: 'Failed to create user profile' };
  }
}

/**
 * Create generation record
 */
export async function createGeneration(
  userId: string,
  inputType: string,
  inputUrl?: string
) {
  const { data, error } = await supabaseAdmin
    .from('generations')
    .insert({
      user_id: userId,
      input_type: inputType,
      input_url: inputUrl,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating generation:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

/**
 * Update generation with outputs
 */
export async function updateGeneration(
  generationId: string,
  updates: Partial<Database['public']['Tables']['generations']['Update']>
) {
  const { data, error } = await supabaseAdmin
    .from('generations')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', generationId)
    .select()
    .single();

  if (error) {
    console.error('Error updating generation:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

/**
 * Get user generations with pagination
 */
export async function getUserGenerations(
  userId: string,
  page: number = 1,
  limit: number = 10
) {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabaseAdmin
    .from('generations')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching user generations:', error);
    return { success: false, error: error.message };
  }

  return {
    success: true,
    data: data || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      has_next: (count || 0) > offset + limit,
      has_prev: page > 1,
    },
  };
}
