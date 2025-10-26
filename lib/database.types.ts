export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          subscription_tier: string;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          subscription_tier?: string;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          subscription_tier?: string;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      credits: {
        Row: {
          id: string;
          user_id: string;
          credits_remaining: number;
          credits_total: number;
          resets_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          credits_remaining?: number;
          credits_total?: number;
          resets_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          credits_remaining?: number;
          credits_total?: number;
          resets_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'credits_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      generations: {
        Row: {
          id: string;
          user_id: string;
          input_type: string;
          input_url: string | null;
          transcript: string;
          outputs: Json;
          status: string;
          error_message: string | null;
          processing_time_ms: number | null;
          retry_count: number;
          max_retries: number;
          scheduled_at: string;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          input_type: string;
          input_url?: string | null;
          transcript?: string;
          outputs?: Json;
          status?: string;
          error_message?: string | null;
          processing_time_ms?: number | null;
          retry_count?: number;
          max_retries?: number;
          scheduled_at?: string;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          input_type?: string;
          input_url?: string | null;
          transcript?: string;
          outputs?: Json;
          status?: string;
          error_message?: string | null;
          processing_time_ms?: number | null;
          retry_count?: number;
          max_retries?: number;
          scheduled_at?: string;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'generations_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      transcript_cache: {
        Row: {
          id: string;
          source_type: string;
          source_identifier: string;
          transcript: string;
          word_count: number | null;
          created_at: string;
          accessed_at: string;
          access_count: number;
        };
        Insert: {
          id?: string;
          source_type: string;
          source_identifier: string;
          transcript: string;
          word_count?: number | null;
          created_at?: string;
          accessed_at?: string;
          access_count?: number;
        };
        Update: {
          id?: string;
          source_type?: string;
          source_identifier?: string;
          transcript?: string;
          word_count?: number | null;
          created_at?: string;
          accessed_at?: string;
          access_count?: number;
        };
        Relationships: [];
      };
      rate_limits: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          request_count: number;
          window_start: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          endpoint: string;
          request_count?: number;
          window_start?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          endpoint?: string;
          request_count?: number;
          window_start?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'rate_limits_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      deduct_credits_atomic: {
        Args: {
          p_user_id: string;
          p_amount?: number;
        };
        Returns: {
          success: boolean;
          remaining: number;
          error_msg: string | null;
        }[];
      };
      get_next_pending_job: {
        Args: {};
        Returns: {
          job_id: string;
          user_id: string;
          input_type: string;
          input_url: string | null;
          transcript: string;
        }[];
      };
      check_rate_limit: {
        Args: {
          p_user_id: string;
          p_endpoint: string;
          p_max_requests?: number;
          p_window_minutes?: number;
        };
        Returns: {
          allowed: boolean;
          remaining: number;
          reset_at: string;
        }[];
      };
      cleanup_old_rate_limits: {
        Args: {};
        Returns: undefined;
      };
      cleanup_old_transcripts: {
        Args: {};
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
