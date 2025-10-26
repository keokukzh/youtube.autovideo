'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Upload interface skeleton component
 * Shows loading state while upload interface loads
 */
export function UploadSkeleton() {
  return (
    <div className="mx-auto max-w-4xl" data-testid="upload-skeleton">
      <Card className="border-0 bg-gradient-to-br from-white to-indigo-50/30 shadow-lg">
        <CardHeader className="pb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            <Skeleton className="h-8 w-8" />
          </div>
          <Skeleton className="mx-auto h-8 w-80" />
          <Skeleton className="mx-auto mt-4 h-6 w-96" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Tabs skeleton */}
            <div className="flex space-x-1">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>

            {/* Form skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
