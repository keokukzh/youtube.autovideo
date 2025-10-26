'use client';

import { useState, useCallback } from 'react';

interface UseDownloadReturn {
  downloadFile: (content: string, filename: string) => void;
  downloadZip: (
    files: Array<{ content: string; filename: string }>,
    zipName: string
  ) => Promise<void>;
  downloading: boolean;
  error: string | null;
}

/**
 * Custom hook for file download operations
 * Handles single file downloads and ZIP archive creation
 */
export function useDownload(): UseDownloadReturn {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadFile = useCallback((content: string, filename: string) => {
    try {
      setError(null);

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to download file';
      setError(errorMessage);
      console.error('Download error:', err);

      // Reset error state after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  }, []);

  const downloadZip = useCallback(
    async (
      files: Array<{ content: string; filename: string }>,
      zipName: string
    ) => {
      try {
        setDownloading(true);
        setError(null);

        // Dynamic import to avoid bundling JSZip in main bundle
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();

        // Add all files to zip
        files.forEach(({ content, filename }) => {
          zip.file(filename, content);
        });

        // Generate and download zip
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);

        const link = document.createElement('a');
        link.href = url;
        link.download = zipName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create ZIP file';
        setError(errorMessage);
        console.error('ZIP download error:', err);

        // Reset error state after 3 seconds
        setTimeout(() => setError(null), 3000);
      } finally {
        setDownloading(false);
      }
    },
    []
  );

  return {
    downloadFile,
    downloadZip,
    downloading,
    error,
  };
}
