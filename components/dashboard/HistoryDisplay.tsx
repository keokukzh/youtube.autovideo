'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Generation, PaginationOptions } from '@/lib/types';
import { formatDate, formatRelativeTime, truncateText } from '@/lib/utils';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Filter,
  Search,
  Type,
  Upload,
  Youtube,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface HistoryDisplayProps {
  generations: Generation[];
  pagination: PaginationOptions;
  currentPage: number;
}

export function HistoryDisplay({
  generations,
  pagination,
  currentPage,
}: HistoryDisplayProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const router = useRouter();

  const filteredGenerations = generations.filter((generation) => {
    const matchesSearch =
      searchTerm === '' ||
      generation.input_url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      generation.transcript?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || generation.status === statusFilter;
    const matchesType =
      typeFilter === 'all' || generation.input_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getInputTypeIcon = (inputType: string) => {
    switch (inputType) {
      case 'youtube':
        return <Youtube className="h-4 w-4 text-red-500" />;
      case 'audio':
        return <Upload className="h-4 w-4 text-blue-500" />;
      case 'text':
        return <Type className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleViewGeneration = (generationId: string) => {
    router.push(`/dashboard/generation/${generationId}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    router.push(`/dashboard/history?${params.toString()}`);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value === 'all') {
      params.delete(filterType);
    } else {
      params.set(filterType, value);
    }
    params.delete('page'); // Reset to first page when filtering
    router.push(`/dashboard/history?${params.toString()}`);
  };

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
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search generations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={statusFilter}
                onValueChange={(value: string) => {
                  setStatusFilter(value);
                  handleFilterChange('status', value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Input Type</label>
              <Select
                value={typeFilter}
                onValueChange={(value: string) => {
                  setTypeFilter(value);
                  handleFilterChange('input_type', value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                    router.push('/dashboard/history');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generations List */}
      <div className="space-y-4">
        {filteredGenerations.map((generation) => (
          <Card
            key={generation.id}
            className="transition-shadow hover:shadow-md"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getInputTypeIcon(generation.input_type)}
                    <span className="text-sm font-medium capitalize">
                      {generation.input_type}
                    </span>
                  </div>
                  {getStatusBadge(generation.status)}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewGeneration(generation.id)}
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    View
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(generation.created_at)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{formatRelativeTime(generation.created_at)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <FileText className="h-4 w-4" />
                  <span>
                    {generation.input_url
                      ? truncateText(generation.input_url, 30)
                      : 'Text Input'}
                  </span>
                </div>
              </div>

              {generation.transcript && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    {truncateText(generation.transcript, 150)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * pagination.limit + 1} to{' '}
            {Math.min(currentPage * pagination.limit, pagination.total)} of{' '}
            {pagination.total} generations
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.has_prev}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-500">
              Page {currentPage} of{' '}
              {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.has_next}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
