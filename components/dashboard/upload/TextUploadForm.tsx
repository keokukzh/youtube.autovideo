'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const textSchema = z.object({
  text: z.string().min(100, 'Text must be at least 100 characters'),
});

type TextForm = z.infer<typeof textSchema>;

interface TextUploadFormProps {
  onSubmit: (data: { text: string }) => Promise<void>;
  isGenerating: boolean;
  error: string | null;
  progress: any;
}

export function TextUploadForm({
  onSubmit,
  isGenerating,
  error,
  progress,
}: TextUploadFormProps) {
  const form = useForm<TextForm>({
    resolver: zodResolver(textSchema),
  });

  const handleSubmit = async (data: TextForm) => {
    await onSubmit(data);
  };

  const textLength = form.watch('text')?.length || 0;
  const isTextValid = textLength >= 100;

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
            htmlFor="text-input"
            className="text-base font-semibold text-gray-900"
          >
            Text Content
          </Label>
          <div className="relative">
            <textarea
              id="text-input"
              className="min-h-[200px] w-full resize-none rounded-lg border border-gray-300 p-4 text-base transition-colors duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
              placeholder="Paste your text content here (minimum 100 characters)..."
              {...form.register('text')}
              disabled={isGenerating}
              aria-describedby="text-input-error text-input-help"
            />
          </div>
          <p id="text-input-help" className="text-sm text-gray-600">
            Paste any text content like blog posts, articles, or transcripts to
            generate multiple formats
          </p>
          {form.formState.errors.text && (
            <p
              id="text-input-error"
              className="text-sm font-medium text-red-600"
            >
              {form.formState.errors.text.message}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className={`h-2 w-2 rounded-full ${isTextValid ? 'bg-green-500' : 'bg-gray-300'}`}
              />
              <p className="text-sm text-gray-600">{textLength} characters</p>
            </div>
            {!isTextValid && textLength > 0 && (
              <p className="text-sm font-medium text-amber-600">
                {100 - textLength} more needed
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="gradient-primary h-12 w-full text-base font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
          disabled={isGenerating || !isTextValid}
          aria-label="Generate content from text"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing Text...
            </>
          ) : (
            <>
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Generate Content
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
