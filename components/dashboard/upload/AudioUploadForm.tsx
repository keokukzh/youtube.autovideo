'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface AudioUploadFormProps {
  onSubmit: () => Promise<void>;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  audioFile: File | null;
  isGenerating: boolean;
  error: string | null;
  progress: any;
}

export function AudioUploadForm({
  onSubmit,
  onFileUpload,
  audioFile,
  isGenerating,
  error,
  progress,
}: AudioUploadFormProps) {
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

      <div className="space-y-4">
        <div className="space-y-3">
          <Label
            htmlFor="audio-file"
            className="text-base font-semibold text-gray-900"
          >
            Audio File Upload
          </Label>
          <div className="relative">
            <Input
              id="audio-file"
              type="file"
              accept="audio/mpeg,audio/mp3,audio/wav,audio/m4a,audio/mp4"
              onChange={onFileUpload}
              disabled={isGenerating}
              aria-describedby="audio-file-help"
              className="h-12 text-base file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <p id="audio-file-help" className="text-sm text-gray-600">
            Upload MP3, WAV, or M4A files up to 25MB. We'll transcribe and
            process your audio content.
          </p>
        </div>

        {audioFile && (
          <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle
                className="h-5 w-5 flex-shrink-0 text-green-600"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-green-800">
                  {audioFile.name}
                </p>
                <p className="text-xs text-green-600">
                  {(audioFile.size / 1024 / 1024).toFixed(2)} MB • Ready to
                  process
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={onSubmit}
        className="gradient-primary h-12 w-full text-base font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
        disabled={isGenerating || !audioFile}
        aria-label="Generate content from audio file"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing Audio...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-5 w-5" />
            Generate Content
          </>
        )}
      </Button>
    </div>
  );
}
