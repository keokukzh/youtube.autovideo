import type { User, Generation, Credits } from '@/lib/types';

/**
 * Mock Supabase client for testing
 */

export const mockSupabaseClient = {
  auth: {
    getUser: jest.fn(),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
  })),
  rpc: jest.fn(),
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(),
      download: jest.fn(),
      remove: jest.fn(),
      getPublicUrl: jest.fn(),
    })),
  },
};

export const mockSupabaseAdmin = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
  })),
  rpc: jest.fn(),
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(),
      download: jest.fn(),
      remove: jest.fn(),
      getPublicUrl: jest.fn(),
    })),
  },
};

// Mock responses
export const mockSupabaseResponses = {
  // Auth responses
  auth: {
    getUser: {
      success: {
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            created_at: '2024-01-01T00:00:00Z',
          },
        },
        error: null,
      },
      error: {
        data: { user: null },
        error: { message: 'Authentication failed' },
      },
    },
    signInWithPassword: {
      success: {
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
          },
          session: {
            access_token: 'test-access-token',
            refresh_token: 'test-refresh-token',
          },
        },
        error: null,
      },
      error: {
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      },
    },
    signUp: {
      success: {
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
          },
          session: null,
        },
        error: null,
      },
      error: {
        data: { user: null, session: null },
        error: { message: 'Email already registered' },
      },
    },
  },

  // Database responses
  database: {
    users: {
      select: {
        success: {
          data: [
            {
              id: 'test-user-id',
              email: 'test@example.com',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            },
          ],
          error: null,
        },
        error: {
          data: null,
          error: { message: 'Database error' },
        },
      },
      insert: {
        success: {
          data: [
            {
              id: 'test-user-id',
              email: 'test@example.com',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            },
          ],
          error: null,
        },
        error: {
          data: null,
          error: { message: 'Insert failed' },
        },
      },
    },
    credits: {
      select: {
        success: {
          data: [
            {
              user_id: 'test-user-id',
              credits: 50,
              subscription_tier: 'starter',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            },
          ],
          error: null,
        },
        error: {
          data: null,
          error: { message: 'Credits not found' },
        },
      },
      update: {
        success: {
          data: [
            {
              user_id: 'test-user-id',
              credits: 49,
              subscription_tier: 'starter',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            },
          ],
          error: null,
        },
        error: {
          data: null,
          error: { message: 'Update failed' },
        },
      },
    },
    generations: {
      select: {
        success: {
          data: [
            {
              id: 'test-generation-id',
              user_id: 'test-user-id',
              input_type: 'youtube',
              input_url: 'https://youtube.com/watch?v=test',
              input_text: null,
              status: 'completed',
              outputs: {
                twitter_posts: ['Test tweet 1', 'Test tweet 2'],
                linkedin_posts: ['Test LinkedIn post'],
                instagram_captions: ['Test Instagram caption'],
                blog_article: 'Test blog article content',
                email_newsletter: 'Test email newsletter content',
                quote_graphics: ['Test quote 1', 'Test quote 2'],
                twitter_thread: ['Test thread tweet 1', 'Test thread tweet 2'],
                podcast_show_notes: 'Test podcast show notes',
                video_script_summary: 'Test video script summary',
                tiktok_hooks: ['Test TikTok hook 1', 'Test TikTok hook 2'],
              },
              error_message: null,
              retry_count: 0,
              max_retries: 3,
              scheduled_at: null,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:05:00Z',
              completed_at: '2024-01-01T00:05:00Z',
              processing_time_ms: 300000,
            },
          ],
          error: null,
        },
        error: {
          data: null,
          error: { message: 'Generation not found' },
        },
      },
      insert: {
        success: {
          data: [
            {
              id: 'test-generation-id',
              user_id: 'test-user-id',
              input_type: 'youtube',
              input_url: 'https://youtube.com/watch?v=test',
              input_text: null,
              status: 'pending',
              outputs: null,
              error_message: null,
              retry_count: 0,
              max_retries: 3,
              scheduled_at: null,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
              completed_at: null,
              processing_time_ms: null,
            },
          ],
          error: null,
        },
        error: {
          data: null,
          error: { message: 'Insert failed' },
        },
      },
      update: {
        success: {
          data: [
            {
              id: 'test-generation-id',
              user_id: 'test-user-id',
              input_type: 'youtube',
              input_url: 'https://youtube.com/watch?v=test',
              input_text: null,
              status: 'completed',
              outputs: {
                twitter_posts: ['Test tweet 1', 'Test tweet 2'],
                linkedin_posts: ['Test LinkedIn post'],
                instagram_captions: ['Test Instagram caption'],
                blog_article: 'Test blog article content',
                email_newsletter: 'Test email newsletter content',
                quote_graphics: ['Test quote 1', 'Test quote 2'],
                twitter_thread: ['Test thread tweet 1', 'Test thread tweet 2'],
                podcast_show_notes: 'Test podcast show notes',
                video_script_summary: 'Test video script summary',
                tiktok_hooks: ['Test TikTok hook 1', 'Test TikTok hook 2'],
              },
              error_message: null,
              retry_count: 0,
              max_retries: 3,
              scheduled_at: null,
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:05:00Z',
              completed_at: '2024-01-01T00:05:00Z',
              processing_time_ms: 300000,
            },
          ],
          error: null,
        },
        error: {
          data: null,
          error: { message: 'Update failed' },
        },
      },
    },
  },

  // RPC responses
  rpc: {
    check_rate_limit: {
      success: {
        data: [
          {
            allowed: true,
            reset_at: new Date(Date.now() + 900000).toISOString(),
          },
        ],
        error: null,
      },
      error: {
        data: null,
        error: { message: 'Rate limit check failed' },
      },
    },
    deduct_credits_atomic: {
      success: {
        data: [
          {
            success: true,
            error_msg: null,
          },
        ],
        error: null,
      },
      error: {
        data: [
          {
            success: false,
            error_msg: 'Insufficient credits',
          },
        ],
        error: null,
      },
    },
  },

  // Storage responses
  storage: {
    upload: {
      success: {
        data: {
          path: 'uploads/test-file.mp3',
          fullPath: 'uploads/test-file.mp3',
        },
        error: null,
      },
      error: {
        data: null,
        error: { message: 'Upload failed' },
      },
    },
    download: {
      success: {
        data: new Blob(['test content']),
        error: null,
      },
      error: {
        data: null,
        error: { message: 'Download failed' },
      },
    },
    getPublicUrl: {
      success: {
        data: {
          publicUrl:
            'https://test.supabase.co/storage/v1/object/public/uploads/test-file.mp3',
        },
        error: null,
      },
    },
  },
};

// Helper functions to set up mocks
export const setupMockSupabase = () => {
  jest.mock('@/lib/supabase', () => ({
    supabase: mockSupabaseClient,
    supabaseAdmin: mockSupabaseAdmin,
  }));
};

export const mockSupabaseQuery = (
  table: string,
  operation: string,
  response: any
) => {
  const mockQuery = mockSupabaseClient.from();
  (mockQuery as any)[operation].mockResolvedValue(response);
  return mockQuery;
};

export const mockSupabaseRPC = (functionName: string, response: any) => {
  mockSupabaseClient.rpc.mockResolvedValue(response);
  return mockSupabaseClient.rpc;
};

// Mock auth state changes
export const mockAuthStateChange = (user: any) => {
  const mockCallback = jest.fn();
  mockSupabaseClient.auth.onAuthStateChange.mockImplementation((callback) => {
    callback('SIGNED_IN', { user });
    return { data: { subscription: { unsubscribe: jest.fn() } } };
  });
  return mockCallback;
};
