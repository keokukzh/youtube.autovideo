'use client';

import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Credits } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Calendar, Coins } from 'lucide-react';

interface CreditCounterProps {
  credits: Credits | null;
}

export const CreditCounter = memo(function CreditCounter({
  credits,
}: CreditCounterProps) {
  // Use mock data in test environment
  const mockCredits =
    typeof window !== 'undefined' && (window as any).__MOCK_CREDITS__;
  const displayCredits = mockCredits || credits;

  if (!displayCredits) {
    return (
      <Card className="w-64">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Loading...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isLowCredits = displayCredits.credits_remaining <= 1;
  const isOutOfCredits = displayCredits.credits_remaining === 0;

  return (
    <Card className="w-full sm:w-64" data-testid="credit-counter">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Credits</span>
          </div>
          <Badge
            variant={
              isOutOfCredits
                ? 'destructive'
                : isLowCredits
                  ? 'secondary'
                  : 'default'
            }
          >
            <span data-testid="credits-remaining">
              {displayCredits.credits_remaining}
            </span>{' '}
            /{' '}
            <span data-testid="credits-total">
              {displayCredits.credits_total}
            </span>
          </Badge>
        </div>

        <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>Resets {formatDate(displayCredits.resets_at)}</span>
        </div>

        {(isOutOfCredits || isLowCredits) && (
          <div className="mt-2">
            <a href="/pricing" className="text-xs text-primary hover:underline">
              {isOutOfCredits
                ? 'Upgrade to get more credits'
                : 'Get more credits'}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
