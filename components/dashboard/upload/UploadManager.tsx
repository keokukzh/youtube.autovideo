'use client';

import { useState, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UploadTabs } from './UploadTabs';
import { UploadProgress } from './UploadProgress';
import { GenerationService } from '@/lib/services/GenerationService';
import { useGenerationPolling } from '@/lib/hooks/use-generation-polling';

export const UploadManager = memo(function UploadManager() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { progress, isPolling, startPolling, stopPolling } =
    useGenerationPolling();

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const validation = GenerationService.validateFile(file);
        if (!validation.valid) {
          setError(validation.error!);
          return;
        }
        setAudioFile(file);
        setError(null);
      }
    },
    []
  );

  const handleYoutubeSubmit = useCallback(async (data: { url: string }) => {
    const validation = GenerationService.validateYouTubeUrl(data.url);
    if (!validation.valid) {
      setError(validation.error!);
      return;
    }
    await generateContent('youtube', { input_url: data.url });
  }, []);

  const handleTextSubmit = useCallback(async (data: { text: string }) => {
    const validation = GenerationService.validateTextInput(data.text);
    if (!validation.valid) {
      setError(validation.error!);
      return;
    }
    await generateContent('text', { input_text: data.text });
  }, []);

  const handleAudioSubmit = useCallback(async () => {
    if (!audioFile) {
      setError('Please select an audio file');
      return;
    }
    await generateContent('audio', { file: audioFile });
  }, [audioFile]);

  const generateContent = async (
    inputType: 'youtube' | 'audio' | 'text',
    data: any
  ) => {
    setError(null);

    try {
      const result = await GenerationService.generateContent(inputType, data);

      if (result.success && result.data?.generation_id) {
        // Start polling for status updates
        startPolling(result.data.generation_id);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      setError(error.message || 'An error occurred during generation');
    }
  };

  // Handle generation completion
  const handleGenerationComplete = useCallback(() => {
    if (progress?.percentage === 100) {
      // Redirect to results page after a short delay
      setTimeout(() => {
        // Note: We need the generation ID from the polling hook
        // This would need to be passed up from the polling hook
        router.push('/dashboard/history');
      }, 1000);
    }
  }, [progress, router]);

  // Monitor for completion
  if (progress?.percentage === 100 && isPolling) {
    stopPolling();
    handleGenerationComplete();
  }

  return (
    <div className="mx-auto max-w-4xl" data-testid="upload-interface">
      <Card className="border-0 bg-gradient-to-br from-white to-indigo-50/30 shadow-lg">
        <CardHeader className="pb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Transform Your Content
          </CardTitle>
          <CardDescription className="mx-auto max-w-2xl text-lg text-gray-600">
            Upload a YouTube video, audio file, or paste text to generate 10+
            ready-to-publish content formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadTabs
            isGenerating={isPolling}
            onYoutubeSubmit={handleYoutubeSubmit}
            onAudioSubmit={handleAudioSubmit}
            onTextSubmit={handleTextSubmit}
            audioFile={audioFile}
            onFileUpload={handleFileUpload}
            error={error}
            progress={progress}
          />

          <UploadProgress
            progress={progress}
            isGenerating={isPolling}
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
});
