'use client';

import { memo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { HistoryCard } from './HistoryCard';
import type { Generation, PaginationOptions } from '@/lib/types';

interface VirtualizedHistoryListProps {
  generations: Generation[];
  pagination: PaginationOptions | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewGeneration: (generationId: string) => void;
}

interface HistoryItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    generations: Generation[];
    onViewGeneration: (generationId: string) => void;
  };
}

const HistoryItem = memo(function HistoryItem({
  index,
  style,
  data,
}: HistoryItemProps) {
  const { generations, onViewGeneration } = data;
  const generation = generations[index];

  return (
    <div style={style} className="virtualized-item">
      <div className="px-4">
        <HistoryCard generation={generation} onView={onViewGeneration} />
      </div>
    </div>
  );
});

/**
 * Virtualized history list component
 * Uses react-window for performance with large lists
 */
export const VirtualizedHistoryList = memo(function VirtualizedHistoryList({
  generations,
  pagination,
  currentPage,
  onPageChange,
  onViewGeneration,
}: VirtualizedHistoryListProps) {
  const itemData = {
    generations,
    onViewGeneration,
  };

  const itemHeight = 200; // Approximate height of each history card

  if (generations.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No generations yet
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Start creating content to see your generation history here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Virtualized List */}
      <div className="h-96">
        <List
          height={400}
          itemCount={generations.length}
          itemSize={itemHeight}
          itemData={itemData}
          overscanCount={5}
        >
          {HistoryItem}
        </List>
      </div>

      {/* Pagination */}
      {pagination && pagination.total > pagination.limit && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * pagination.limit + 1} to{' '}
            {Math.min(currentPage * pagination.limit, pagination.total)} of{' '}
            {pagination.total} generations
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!pagination.has_prev}
              className="rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {currentPage} of{' '}
              {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!pagination.has_next}
              className="rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
