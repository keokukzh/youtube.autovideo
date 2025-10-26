'use client';

import { useState, useCallback, useRef } from 'react';
import type { GenerationProgress } from '@/lib/types';

interface UseGenerationPollingReturn {
  progress: GenerationProgress | null;
  isPolling: boolean;
  error: string | null;
  startPolling: (generationId: string) => void;
  stopPolling: () => void;
}

/**
 * Custom hook for polling generation status
 * Handles automatic polling with exponential backoff and cleanup
 */
export function useGenerationPolling(): UseGenerationPollingReturn {
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const attemptsRef = useRef(0);

  const maxAttempts = 60; // 3 minutes max (60 * 3 seconds)
  const baseDelay = 3000; // 3 seconds base delay

  const pollGeneration = useCallback(async (generationId: string) => {
    try {
      const response = await fetch(`/api/generation/${generationId}`);
      const data = await response.json();

      if (data.status === 'completed') {
        setProgress({
          step: 4,
          total: 4,
          message: 'Generation completed!',
          percentage: 100,
        });
        stopPolling();
        return;
      }

      if (data.status === 'failed') {
        setError(data.error || 'Generation failed');
        stopPolling();
        return;
      }

      // Update progress based on status
      if (data.status === 'processing') {
        setProgress({
          step: 3,
          total: 4,
          message: 'Generating content...',
          percentage: Math.max(50, data.progress || 50),
        });
      } else if (data.status === 'pending') {
        setProgress({
          step: 2,
          total: 4,
          message: 'Processing in queue...',
          percentage: 25,
        });
      }

      // Continue polling with exponential backoff
      attemptsRef.current++;
      if (attemptsRef.current < maxAttempts) {
        const delay = Math.min(
          baseDelay * Math.pow(1.2, attemptsRef.current),
          10000
        );
        timeoutRef.current = setTimeout(() => {
          pollGeneration(generationId);
        }, delay);
      } else {
        setError('Generation timeout - please check history');
        stopPolling();
      }
    } catch (err) {
      console.error('Polling error:', err);
      setError('Failed to check generation status');
      stopPolling();
    }
  }, []);

  const startPolling = useCallback(
    (generationId: string) => {
      setError(null);
      setProgress({
        step: 1,
        total: 4,
        message: 'Starting generation...',
        percentage: 0,
      });
      setIsPolling(true);
      attemptsRef.current = 0;
      pollGeneration(generationId);
    },
    [pollGeneration]
  );

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    stopPolling();
  }, [stopPolling]);

  return {
    progress,
    isPolling,
    error,
    startPolling,
    stopPolling: cleanup,
  };
}
