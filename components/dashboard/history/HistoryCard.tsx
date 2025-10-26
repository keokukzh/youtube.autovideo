'use client';

import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Generation } from '@/lib/types';
import { formatDate, formatRelativeTime, truncateText } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Eye,
  FileText,
  Type,
  Upload,
  Youtube,
} from 'lucide-react';

interface HistoryCardProps {
  generation: Generation;
  onView: (generationId: string) => void;
}

/**
 * Individual history card component
 * Displays generation information in a card format
 */
export const HistoryCard = memo(function HistoryCard({
  generation,
  onView,
}: HistoryCardProps) {
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

  return (
    <Card className="transition-shadow hover:shadow-md">
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
              onClick={() => onView(generation.id)}
              aria-label={`View generation ${generation.id}`}
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
  );
});
