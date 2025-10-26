'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Credits } from '@/lib/types';

interface UseCreditsReturn {
  credits: Credits | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isLowCredits: boolean;
  isOutOfCredits: boolean;
}

/**
 * Custom hook for managing user credits
 * Handles fetching, caching, and state management for credits
 */
export function useCredits(): UseCreditsReturn {
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/credits');
      if (!response.ok) {
        throw new Error('Failed to fetch credits');
      }

      const data = await response.json();
      if (data.success && data.data) {
        setCredits(data.data);
      } else {
        throw new Error(data.error || 'Invalid response');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching credits:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchCredits();
  }, [fetchCredits]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const isLowCredits = credits ? credits.credits_remaining <= 1 : false;
  const isOutOfCredits = credits ? credits.credits_remaining === 0 : false;

  return {
    credits,
    loading,
    error,
    refetch,
    isLowCredits,
    isOutOfCredits,
  };
}
