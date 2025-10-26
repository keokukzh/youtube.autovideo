'use client';

import { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useClipboard } from '@/lib/hooks/use-clipboard';
import { useDownload } from '@/lib/hooks/use-download';
import { Check, Copy, Download, Loader2 } from 'lucide-react';

interface OutputActionsProps {
  content: string;
  filename: string;
  title: string;
}

/**
 * Output actions component
 * Handles copy and download actions for individual content items
 */
export const OutputActions = memo(function OutputActions({
  content,
  filename,
  title,
}: OutputActionsProps) {
  const { copyToClipboard, copied } = useClipboard();
  const { downloadFile, downloading } = useDownload();

  const handleCopy = useCallback(async () => {
    await copyToClipboard(content);
  }, [content, copyToClipboard]);

  const handleDownload = useCallback(() => {
    downloadFile(content, filename);
  }, [content, filename, downloadFile]);

  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleCopy}
        disabled={copied}
        aria-label={`Copy ${title}`}
      >
        {copied ? (
          <Check className="mr-1 h-3 w-3" />
        ) : (
          <Copy className="mr-1 h-3 w-3" />
        )}
        {copied ? 'Copied!' : 'Copy'}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleDownload}
        disabled={downloading}
        aria-label={`Download ${title}`}
      >
        {downloading ? (
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        ) : (
          <Download className="mr-1 h-3 w-3" />
        )}
        Download
      </Button>
    </div>
  );
});
