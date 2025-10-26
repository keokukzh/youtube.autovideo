'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  'aria-label'?: string;
}

export const LoadingSpinner = memo(function LoadingSpinner({
  size = 'md',
  className,
  text,
  'aria-label': ariaLabel = 'Loading',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div
      className={cn('flex items-center justify-center', className)}
      role="status"
      aria-label={ariaLabel}
    >
      <div className="flex flex-col items-center space-y-2">
        <Loader2
          className={cn('animate-spin', sizeClasses[size])}
          aria-hidden="true"
        />
        {text && (
          <p className="text-sm text-gray-500" aria-live="polite">
            {text}
          </p>
        )}
      </div>
    </div>
  );
});

export const PageLoadingSpinner = memo(function PageLoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <LoadingSpinner size="lg" text="Loading..." aria-label="Loading page" />
    </div>
  );
});

export const CardLoadingSpinner = memo(function CardLoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner
        size="md"
        text="Loading..."
        aria-label="Loading content"
      />
    </div>
  );
});
