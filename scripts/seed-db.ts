/**
 * Database seeding script for development
 * This script populates the database with sample data for testing
 */

import { supabaseAdmin } from '../lib/supabase';
import {
  createMockUser,
  createMockCredits,
  createMockGeneration,
} from '../__tests__/utils/test-helpers';

/**
 * Seed users with different subscription tiers
 */
async function seedUsers() {
  console.log('🌱 Seeding users...');

  const users = [
    createMockUser({
      id: 'user-1',
      email: 'admin@example.com',
      subscription_tier: 'TEAM',
    }),
    createMockUser({
      id: 'user-2',
      email: 'pro@example.com',
      subscription_tier: 'PRO',
    }),
    createMockUser({
      id: 'user-3',
      email: 'starter@example.com',
      subscription_tier: 'STARTER',
    }),
    createMockUser({
      id: 'user-4',
      email: 'free@example.com',
      subscription_tier: 'FREE',
    }),
  ];

  for (const user of users) {
    const { error } = await supabaseAdmin
      .from('users')
      .upsert(user, { onConflict: 'id' });

    if (error) {
      console.error(`Error seeding user ${user.email}:`, error);
    } else {
      console.log(`✅ Seeded user: ${user.email}`);
    }
  }
}

/**
 * Seed credits for users
 */
async function seedCredits() {
  console.log('🌱 Seeding credits...');

  const credits = [
    createMockCredits({
      id: 'credits-1',
      user_id: 'user-1',
      credits_remaining: 500,
      credits_total: 500,
    }),
    createMockCredits({
      id: 'credits-2',
      user_id: 'user-2',
      credits_remaining: 200,
      credits_total: 200,
    }),
    createMockCredits({
      id: 'credits-3',
      user_id: 'user-3',
      credits_remaining: 50,
      credits_total: 50,
    }),
    createMockCredits({
      id: 'credits-4',
      user_id: 'user-4',
      credits_remaining: 5,
      credits_total: 5,
    }),
  ];

  for (const credit of credits) {
    const { error } = await supabaseAdmin
      .from('credits')
      .upsert(credit, { onConflict: 'id' });

    if (error) {
      console.error(`Error seeding credits for user ${credit.user_id}:`, error);
    } else {
      console.log(`✅ Seeded credits for user: ${credit.user_id}`);
    }
  }
}

/**
 * Seed sample generations
 */
async function seedGenerations() {
  console.log('🌱 Seeding generations...');

  const generations = [
    createMockGeneration({
      id: 'gen-1',
      user_id: 'user-1',
      input_type: 'youtube',
      input_url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      status: 'completed',
    }),
    createMockGeneration({
      id: 'gen-2',
      user_id: 'user-2',
      input_type: 'text',
      status: 'completed',
    }),
    createMockGeneration({
      id: 'gen-3',
      user_id: 'user-3',
      input_type: 'audio',
      status: 'processing',
    }),
    createMockGeneration({
      id: 'gen-4',
      user_id: 'user-4',
      input_type: 'youtube',
      input_url: 'https://youtube.com/watch?v=example',
      status: 'failed',
      error_message: 'Video not found',
    }),
  ];

  for (const generation of generations) {
    const { error } = await supabaseAdmin
      .from('generations')
      .upsert(generation, { onConflict: 'id' });

    if (error) {
      console.error(`Error seeding generation ${generation.id}:`, error);
    } else {
      console.log(`✅ Seeded generation: ${generation.id}`);
    }
  }
}

/**
 * Seed transcript cache
 */
async function seedTranscriptCache() {
  console.log('🌱 Seeding transcript cache...');

  const cacheEntries = [
    {
      id: 'cache-1',
      source_type: 'youtube',
      source_identifier: 'dQw4w9WgXcQ',
      transcript: 'Never gonna give you up, never gonna let you down...',
      word_count: 50,
      access_count: 5,
      created_at: new Date().toISOString(),
      accessed_at: new Date().toISOString(),
    },
    {
      id: 'cache-2',
      source_type: 'text',
      source_identifier: 'sample-text-hash',
      transcript:
        'This is a sample text for testing purposes. It contains enough words to be considered valid content for generation.',
      word_count: 20,
      access_count: 2,
      created_at: new Date().toISOString(),
      accessed_at: new Date().toISOString(),
    },
  ];

  for (const entry of cacheEntries) {
    const { error } = await supabaseAdmin
      .from('transcript_cache')
      .upsert(entry, { onConflict: 'id' });

    if (error) {
      console.error(`Error seeding cache entry ${entry.id}:`, error);
    } else {
      console.log(`✅ Seeded cache entry: ${entry.id}`);
    }
  }
}

/**
 * Clear existing data
 */
async function clearData() {
  console.log('🧹 Clearing existing data...');

  const tables = [
    'transcript_cache',
    'generations',
    'credits',
    'users',
  ] as const;

  for (const table of tables) {
    const { error } = await supabaseAdmin
      .from(table)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (error) {
      console.error(`Error clearing table ${table}:`, error);
    } else {
      console.log(`✅ Cleared table: ${table}`);
    }
  }
}

/**
 * Main seeding function
 */
async function seedDatabase() {
  try {
    console.log('🚀 Starting database seeding...');
    console.log('================================');

    // Clear existing data
    await clearData();

    // Seed data
    await seedUsers();
    await seedCredits();
    await seedGenerations();
    await seedTranscriptCache();

    console.log('================================');
    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('Sample data created:');
    console.log('- 4 users with different subscription tiers');
    console.log('- Credits for each user');
    console.log('- Sample generations with different statuses');
    console.log('- Transcript cache entries');
    console.log('');
    console.log('You can now test the application with this sample data.');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
