'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import type { PaginationOptions } from '@/lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HistoryPaginationProps {
  pagination: PaginationOptions;
  currentPage: number;
  onPageChange: (page: number) => void;
}

/**
 * History pagination component
 * Handles page navigation for generation history
 */
export const HistoryPagination = memo(function HistoryPagination({
  pagination,
  currentPage,
  onPageChange,
}: HistoryPaginationProps) {
  if (pagination.total <= pagination.limit) {
    return null;
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const startItem = (currentPage - 1) * pagination.limit + 1;
  const endItem = Math.min(currentPage * pagination.limit, pagination.total);

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Showing {startItem} to {endItem} of {pagination.total} generations
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.has_prev}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.has_next}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});
