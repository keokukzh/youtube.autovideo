/**
 * User subscription tiers
 */
export type SubscriptionTier = 'FREE' | 'STARTER' | 'PRO' | 'TEAM';

/**
 * Input types for content generation
 */
export type InputType = 'youtube' | 'audio' | 'text';

/**
 * Generation status
 */
export type GenerationStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  subscription_tier: SubscriptionTier;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Credits interface
 */
export interface Credits {
  id: string;
  user_id: string;
  credits_remaining: number;
  credits_total: number;
  resets_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Content generation outputs
 */
export interface ContentOutputs {
  twitter_posts: string[];
  linkedin_posts: string[];
  instagram_captions: string[];
  blog_article: {
    title: string;
    content: string;
    word_count: number;
  };
  email_newsletter: {
    subject: string;
    content: string;
    word_count: number;
  };
  quote_graphics: string[];
  twitter_thread: string[];
  podcast_show_notes: string[];
  video_script_summary: string;
  tiktok_hooks: string[];
}

/**
 * Generation interface
 */
export interface Generation {
  id: string;
  user_id: string;
  input_type: InputType;
  input_url?: string;
  transcript: string;
  outputs: ContentOutputs;
  status: GenerationStatus;
  created_at: string;
  updated_at: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Generation request payload
 */
export interface GenerationRequest {
  input_type: InputType;
  input_url?: string;
  input_text?: string;
  file?: File;
}

/**
 * Pricing tier configuration
 */
export interface PricingTier {
  id: SubscriptionTier;
  name: string;
  price: number;
  credits: number;
  features: string[];
  popular?: boolean;
  annual_discount?: number;
}

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

/**
 * Form validation error
 */
export interface FormError {
  field: string;
  message: string;
}

/**
 * File upload progress
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Generation progress steps
 */
export interface GenerationProgress {
  step: number;
  total: number;
  message: string;
  percentage: number;
}

/**
 * Dashboard stats
 */
export interface DashboardStats {
  total_generations: number;
  credits_used: number;
  credits_remaining: number;
  last_generation?: string;
}

/**
 * History filter options
 */
export interface HistoryFilter {
  status?: GenerationStatus;
  input_type?: InputType;
  date_from?: string;
  date_to?: string;
  search?: string;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
  has_next: boolean;
  has_prev: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationOptions;
}
