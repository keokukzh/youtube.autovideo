'use client';

import { useState, useCallback } from 'react';

interface UseClipboardReturn {
  copyToClipboard: (text: string) => Promise<boolean>;
  copied: boolean;
  error: string | null;
}

/**
 * Custom hook for clipboard operations
 * Handles copying text to clipboard with user feedback
 */
export function useClipboard(): UseClipboardReturn {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        setError(null);

        if (!navigator.clipboard) {
          throw new Error('Clipboard API not supported');
        }

        await navigator.clipboard.writeText(text);
        setCopied(true);

        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to copy to clipboard';
        setError(errorMessage);
        console.error('Clipboard error:', err);

        // Reset error state after 3 seconds
        setTimeout(() => setError(null), 3000);

        return false;
      }
    },
    []
  );

  return {
    copyToClipboard,
    copied,
    error,
  };
}
