import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { NextIntlClientProvider } from 'next-intl';

// Mock Next.js router
export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  route: '/',
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
};

// Mock Next.js useRouter hook
jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

// Mock Next.js usePathname hook
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => mockRouter,
}));

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock Supabase client
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
  })),
  rpc: jest.fn(),
};

// Mock OpenAI client
export const mockOpenAIClient = {
  chat: {
    completions: {
      create: jest.fn(),
    },
  },
  audio: {
    transcriptions: {
      create: jest.fn(),
    },
  },
};

// Mock Stripe client
export const mockStripeClient = {
  customers: {
    create: jest.fn(),
    retrieve: jest.fn(),
    update: jest.fn(),
  },
  subscriptions: {
    create: jest.fn(),
    retrieve: jest.fn(),
    update: jest.fn(),
    cancel: jest.fn(),
  },
  prices: {
    create: jest.fn(),
    retrieve: jest.fn(),
    list: jest.fn(),
  },
  checkout: {
    sessions: {
      create: jest.fn(),
      retrieve: jest.fn(),
    },
  },
};

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  subscription_tier: 'FREE',
  stripe_customer_id: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockCredits = (overrides = {}) => ({
  id: 'test-credits-id',
  user_id: 'test-user-id',
  credits_remaining: 5,
  credits_total: 5,
  resets_at: '2024-02-01T00:00:00Z',
  ...overrides,
});

export const createMockGeneration = (overrides = {}) => ({
  id: 'test-generation-id',
  user_id: 'test-user-id',
  input_type: 'youtube',
  input_url: 'https://youtube.com/watch?v=test',
  transcript: 'Test transcript content',
  outputs: {
    twitter_posts: ['Test tweet 1', 'Test tweet 2'],
    linkedin_posts: ['Test LinkedIn post'],
    instagram_captions: ['Test Instagram caption'],
    blog_article: 'Test blog article content',
    email_newsletter: 'Test email newsletter content',
    quote_graphics: ['Test quote 1', 'Test quote 2'],
    twitter_thread: ['Thread tweet 1', 'Thread tweet 2'],
    podcast_show_notes: 'Test show notes',
    video_script_summary: 'Test script summary',
    tiktok_hooks: ['Test hook 1', 'Test hook 2'],
  },
  status: 'completed',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

// Custom Jest matchers
expect.extend({
  toBeValidEmail(received: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid email`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid email`,
        pass: false,
      };
    }
  },
  toBeValidYouTubeUrl(received: string) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
    const pass = youtubeRegex.test(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid YouTube URL`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid YouTube URL`,
        pass: false,
      };
    }
  },
});

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
