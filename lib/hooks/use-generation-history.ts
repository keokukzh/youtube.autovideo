'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Generation, HistoryFilter, PaginationOptions } from '@/lib/types';

interface UseGenerationHistoryReturn {
  generations: Generation[];
  pagination: PaginationOptions | null;
  loading: boolean;
  error: string | null;
  filters: HistoryFilter;
  setFilters: (filters: HistoryFilter) => void;
  refetch: () => Promise<void>;
  goToPage: (page: number) => void;
}

/**
 * Custom hook for managing generation history
 * Handles fetching, filtering, and pagination of generation history
 */
export function useGenerationHistory(
  initialFilters: HistoryFilter = {}
): UseGenerationHistoryReturn {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [pagination, setPagination] = useState<PaginationOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<HistoryFilter>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', '10');

      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, value.toString());
        }
      });

      const response = await fetch(`/api/generations?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch generation history');
      }

      const data = await response.json();
      if (data.success && data.data) {
        setGenerations(data.data.generations || []);
        setPagination(data.data.pagination || null);
      } else {
        throw new Error(data.error || 'Invalid response');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching generation history:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  const refetch = useCallback(async () => {
    await fetchHistory();
  }, [fetchHistory]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSetFilters = useCallback((newFilters: HistoryFilter) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    generations,
    pagination,
    loading,
    error,
    filters,
    setFilters: handleSetFilters,
    refetch,
    goToPage,
  };
}
