'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Youtube } from 'lucide-react';
import { isValidYouTubeUrl } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const youtubeSchema = z.object({
  url: z.string().refine(isValidYouTubeUrl, 'Please enter a valid YouTube URL'),
});

type YoutubeForm = z.infer<typeof youtubeSchema>;

interface YoutubeUploadFormProps {
  onSubmit: (data: { url: string }) => Promise<void>;
  isGenerating: boolean;
  error: string | null;
  progress: any;
}

export function YoutubeUploadForm({
  onSubmit,
  isGenerating,
  error,
  progress,
}: YoutubeUploadFormProps) {
  const form = useForm<YoutubeForm>({
    resolver: zodResolver(youtubeSchema),
  });

  const handleSubmit = async (data: YoutubeForm) => {
    await onSubmit(data);
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {progress && (
        <div className="space-y-3 rounded-lg border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-gray-700">{progress.message}</span>
            <span className="font-semibold text-indigo-600">
              {progress.step}/{progress.total}
            </span>
          </div>
          <Progress value={progress.percentage} className="h-2 w-full" />
          <div className="text-center text-xs text-gray-500">
            {progress.percentage}% complete
          </div>
        </div>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-3">
          <Label
            htmlFor="youtube-url"
            className="text-base font-semibold text-gray-900"
          >
            YouTube Video URL
          </Label>
          <div className="relative">
            <Input
              id="youtube-url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              {...form.register('url')}
              disabled={isGenerating}
              aria-describedby="youtube-url-error youtube-url-help"
              className="h-12 pl-10 text-base"
            />
            <Youtube className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          </div>
          <p id="youtube-url-help" className="text-sm text-gray-600">
            Paste any YouTube video URL to extract and process the content
          </p>
          {form.formState.errors.url && (
            <p
              id="youtube-url-error"
              className="text-sm font-medium text-red-600"
            >
              {form.formState.errors.url.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="gradient-primary h-12 w-full text-base font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
          disabled={isGenerating}
          aria-label="Generate content from YouTube video"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing Video...
            </>
          ) : (
            <>
              <Youtube className="mr-2 h-5 w-5" />
              Generate Content
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
