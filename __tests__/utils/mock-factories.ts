import {
  createMockUser,
  createMockCredits,
  createMockGeneration,
} from './test-helpers';

// User factory with common variations
export const userFactory = {
  free: () => createMockUser({ subscription_tier: 'FREE' }),
  starter: () => createMockUser({ subscription_tier: 'STARTER' }),
  pro: () => createMockUser({ subscription_tier: 'PRO' }),
  team: () => createMockUser({ subscription_tier: 'TEAM' }),
  withStripe: (customerId: string) =>
    createMockUser({ stripe_customer_id: customerId }),
};

// Credits factory with common variations
export const creditsFactory = {
  full: () => createMockCredits({ credits_remaining: 5, credits_total: 5 }),
  half: () => createMockCredits({ credits_remaining: 2, credits_total: 5 }),
  empty: () => createMockCredits({ credits_remaining: 0, credits_total: 5 }),
  starter: () =>
    createMockCredits({ credits_remaining: 50, credits_total: 50 }),
  pro: () => createMockCredits({ credits_remaining: 200, credits_total: 200 }),
  team: () => createMockCredits({ credits_remaining: 500, credits_total: 500 }),
};

// Generation factory with common variations
export const generationFactory = {
  youtube: () =>
    createMockGeneration({
      input_type: 'youtube',
      input_url: 'https://youtube.com/watch?v=test123',
    }),
  audio: () =>
    createMockGeneration({
      input_type: 'audio',
      input_url: null,
    }),
  text: () =>
    createMockGeneration({
      input_type: 'text',
      input_url: null,
    }),
  pending: () => createMockGeneration({ status: 'pending' }),
  processing: () => createMockGeneration({ status: 'processing' }),
  completed: () => createMockGeneration({ status: 'completed' }),
  failed: () => createMockGeneration({ status: 'failed' }),
};

// API response factories
export const apiResponseFactory = {
  success: (data: any) => ({
    success: true,
    data,
    message: 'Success',
  }),
  error: (error: string, statusCode = 400) => ({
    success: false,
    error,
    statusCode,
  }),
  validationError: (field: string, message: string) => ({
    success: false,
    error: 'Validation failed',
    details: { [field]: message },
  }),
  rateLimitError: () => ({
    success: false,
    error: 'Rate limit exceeded',
    retryAfter: 900,
  }),
  insufficientCredits: () => ({
    success: false,
    error: 'Insufficient credits',
    required: 1,
    available: 0,
  }),
};

// OpenAI response factories
export const openaiResponseFactory = {
  chatCompletion: (content: string) => ({
    choices: [
      {
        message: {
          content,
          role: 'assistant',
        },
      },
    ],
    usage: {
      prompt_tokens: 100,
      completion_tokens: 50,
      total_tokens: 150,
    },
  }),
  transcription: (text: string) => ({
    text,
  }),
};

// Stripe response factories
export const stripeResponseFactory = {
  customer: (id: string, email: string) => ({
    id,
    email,
    object: 'customer',
    created: Math.floor(Date.now() / 1000),
  }),
  subscription: (id: string, customerId: string, status: string) => ({
    id,
    customer: customerId,
    status,
    object: 'subscription',
    created: Math.floor(Date.now() / 1000),
  }),
  price: (id: string, amount: number, currency: string) => ({
    id,
    unit_amount: amount,
    currency,
    object: 'price',
    active: true,
  }),
  checkoutSession: (id: string, url: string) => ({
    id,
    url,
    object: 'checkout.session',
    payment_status: 'unpaid',
  }),
};

// Form data factories
export const formDataFactory = {
  youtube: (url: string) => {
    const formData = new FormData();
    formData.append('input_type', 'youtube');
    formData.append('input_url', url);
    return formData;
  },
  audio: (file: File) => {
    const formData = new FormData();
    formData.append('input_type', 'audio');
    formData.append('file', file);
    return formData;
  },
  text: (text: string) => {
    const formData = new FormData();
    formData.append('input_type', 'text');
    formData.append('input_text', text);
    return formData;
  },
};

// Mock file factory
export const mockFileFactory = {
  audio: (name: string, size: number, type: string) => {
    const file = new File(['mock audio content'], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  },
  validAudio: () =>
    mockFileFactory.audio('test.mp3', 1024 * 1024, 'audio/mpeg'),
  largeAudio: () =>
    mockFileFactory.audio('large.mp3', 30 * 1024 * 1024, 'audio/mpeg'),
  invalidType: () => mockFileFactory.audio('test.txt', 1024, 'text/plain'),
};

// Environment variables factory
export const envFactory = {
  development: () => ({
    NODE_ENV: 'development',
    NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
    OPENAI_API_KEY: 'sk-test-key',
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  }),
  production: () => ({
    NODE_ENV: 'production',
    NEXT_PUBLIC_SUPABASE_URL: 'https://prod.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'prod-anon-key',
    SUPABASE_SERVICE_ROLE_KEY: 'prod-service-key',
    OPENAI_API_KEY: 'sk-prod-key',
    NEXT_PUBLIC_APP_URL: 'https://contentmultiplier.io',
  }),
};
