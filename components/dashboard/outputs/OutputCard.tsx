'use client';

import { memo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OutputActions } from './OutputActions';
import { truncateText } from '@/lib/utils';

interface OutputCardProps {
  title: string;
  icon: React.ReactNode;
  content: string | string[];
  format: string;
  isArray?: boolean;
}

/**
 * Individual output card component
 * Displays content with copy/download actions
 */
export const OutputCard = memo(function OutputCard({
  title,
  icon,
  content,
  format,
  isArray = false,
}: OutputCardProps) {
  const displayContent = isArray ? (content as string[]) : [content as string];
  const count = displayContent.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge variant="secondary">
            {count} {count === 1 ? 'item' : 'items'}
          </Badge>
        </div>
        <CardDescription>{format} • Click to copy or download</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayContent.map((item, index) => (
          <div key={index} className="space-y-3">
            {count > 1 && (
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">
                  {title} #{index + 1}
                </h4>
                <OutputActions
                  content={item}
                  filename={`${title.toLowerCase().replace(/\s+/g, '-')}-${index + 1}.txt`}
                  title={`${title} #${index + 1}`}
                />
              </div>
            )}
            <div className="rounded-md bg-gray-50 p-3">
              <p className="whitespace-pre-wrap text-sm text-gray-700">
                {truncateText(item, 300)}
              </p>
              {item.length > 300 && (
                <p className="mt-2 text-xs text-gray-500">
                  {item.length} characters • Click copy/download for full content
                </p>
              )}
            </div>
            {count === 1 && (
              <div className="flex justify-end">
                <OutputActions
                  content={item}
                  filename={`${title.toLowerCase().replace(/\s+/g, '-')}.txt`}
                  title={title}
                />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
});
