'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { HistoryCard } from './HistoryCard';
import { HistoryPagination } from './HistoryPagination';
import type { Generation, PaginationOptions } from '@/lib/types';
import { FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HistoryListProps {
  generations: Generation[];
  pagination: PaginationOptions | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewGeneration: (generationId: string) => void;
}

/**
 * History list component
 * Displays list of generations with pagination
 */
export const HistoryList = memo(function HistoryList({
  generations,
  pagination,
  currentPage,
  onPageChange,
  onViewGeneration,
}: HistoryListProps) {
  const router = useRouter();

  if (generations.length === 0) {
    return (
      <div className="py-12 text-center">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No generations yet
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Start creating content to see your generation history here.
        </p>
        <div className="mt-6">
          <Button onClick={() => router.push('/dashboard')}>
            Create Your First Generation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Generations List */}
      <div className="space-y-4" data-testid="history-list">
        {generations.map((generation) => (
          <HistoryCard
            key={generation.id}
            generation={generation}
            onView={onViewGeneration}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <HistoryPagination
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
});
