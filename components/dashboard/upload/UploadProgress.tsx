'use client';

import { memo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAriaLive } from '@/components/ui/aria-live-region';
import type { GenerationProgress } from '@/lib/types';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadProgressProps {
  progress: GenerationProgress | null;
  isGenerating: boolean;
  error: string | null;
}

/**
 * Upload progress component
 * Displays generation progress with visual indicators
 */
export const UploadProgress = memo(function UploadProgress({
  progress,
  isGenerating,
  error,
}: UploadProgressProps) {
  const { announce } = useAriaLive();

  // Announce progress changes to screen readers
  useEffect(() => {
    if (progress) {
      announce(`Generation progress: ${progress.message} - ${progress.percentage}% complete`);
    }
  }, [progress, announce]);

  // Announce errors to screen readers
  useEffect(() => {
    if (error) {
      announce(`Generation error: ${error}`, 'assertive');
    }
  }, [error, announce]);

  if (!isGenerating && !progress && !error) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Progress Header */}
          <div className="flex items-center space-x-3">
            {error ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : progress?.percentage === 100 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            )}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                {error ? 'Generation Failed' : 'Generating Content'}
              </h3>
              <p className="text-sm text-gray-500">
                {error || progress?.message || 'Processing...'}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {progress && !error && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Step {progress.step} of {progress.total}</span>
                <span>{progress.percentage}%</span>
              </div>
              <Progress 
                value={progress.percentage} 
                className="h-2"
                aria-label={`Generation progress: ${progress.percentage}%`}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
