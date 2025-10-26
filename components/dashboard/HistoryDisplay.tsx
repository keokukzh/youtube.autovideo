'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { HistoryFilters } from './history/HistoryFilters';
import { HistoryList } from './history/HistoryList';
import { useGenerationHistory } from '@/lib/hooks/use-generation-history';
import { useDebounce } from '@/lib/hooks/use-debounce';
import type { Generation, PaginationOptions, HistoryFilter } from '@/lib/types';

interface HistoryDisplayProps {
  generations: Generation[];
  pagination: PaginationOptions;
  currentPage: number;
}

/**
 * History display component
 * Now uses refactored components and custom hooks for better separation of concerns
 */
export function HistoryDisplay({
  generations,
  pagination,
  currentPage,
}: HistoryDisplayProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Use the custom hook for history management
  const { filters, setFilters, goToPage } = useGenerationHistory({
    search: debouncedSearchTerm,
  });

  const handleViewGeneration = useCallback(
    (generationId: string) => {
      router.push(`/dashboard/generation-detail?id=${generationId}`);
    },
    [router]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      goToPage(page);
    },
    [goToPage]
  );

  const handleFiltersChange = useCallback(
    (newFilters: HistoryFilter) => {
      setFilters(newFilters);
    },
    [setFilters]
  );

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
  }, [setFilters]);

  return (
    <div className="space-y-6">
      <HistoryFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      <HistoryList
        generations={generations}
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onViewGeneration={handleViewGeneration}
      />
    </div>
  );
}
