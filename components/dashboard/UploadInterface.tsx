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
import { UploadTabs } from './upload/UploadTabs';
import type { GenerationProgress } from '@/lib/types';

export const UploadInterface = memo(function UploadInterface() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Validate file type
        const allowedTypes = [
          'audio/mpeg',
          'audio/mp3',
          'audio/wav',
          'audio/m4a',
          'audio/mp4',
        ];
        if (!allowedTypes.includes(file.type)) {
          setError('Please upload an MP3, WAV, or M4A file');
          return;
        }

        // Validate file size (25MB max for Whisper API)
        const maxSize = 25 * 1024 * 1024;
        if (file.size > maxSize) {
          setError('File too large. Please use files smaller than 25MB');
          return;
        }

        setAudioFile(file);
        setError(null);
      }
    },
    []
  );

  const handleYoutubeSubmit = useCallback(async (data: { url: string }) => {
    await generateContent('youtube', { input_url: data.url });
  }, []);

  const handleTextSubmit = useCallback(async (data: { text: string }) => {
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
    setIsGenerating(true);
    setError(null);
    setProgress({
      step: 1,
      total: 4,
      message: 'Starting generation...',
      percentage: 0,
    });

    try {
      const formData = new FormData();
      formData.append('input_type', inputType);

      if (inputType === 'youtube') {
        formData.append('input_url', data.input_url);
      } else if (inputType === 'text') {
        formData.append('input_text', data.input_text);
      } else if (inputType === 'audio' && data.file) {
        formData.append('file', data.file);
      }

      setProgress({
        step: 1,
        total: 4,
        message: 'Queuing generation...',
        percentage: 25,
      });

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const result = await response.json();

      if (result.success && result.data?.generation_id) {
        // Start polling for status updates
        await pollGeneration(result.data.generation_id);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      setError(error.message || 'An error occurred during generation');
    } finally {
      setIsGenerating(false);
      setProgress(null);
    }
  };

  const pollGeneration = async (generationId: string) => {
    const maxAttempts = 60; // 3 minutes max (60 * 3 seconds)
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/generation/${generationId}`);
        const data = await response.json();

        if (data.status === 'completed') {
          setProgress({
            step: 4,
            total: 4,
            message: 'Generation completed!',
            percentage: 100,
          });

          // Redirect to results page
          setTimeout(() => {
            router.push(`/dashboard/generation/${generationId}`);
          }, 1000);
          return;
        }

        if (data.status === 'failed') {
          setError(data.error || 'Generation failed');
          return;
        }

        // Update progress based on status
        if (data.status === 'processing') {
          setProgress({
            step: 3,
            total: 4,
            message: 'Generating content...',
            percentage: Math.max(50, data.progress || 50),
          });
        } else if (data.status === 'pending') {
          setProgress({
            step: 2,
            total: 4,
            message: 'Processing in queue...',
            percentage: 25,
          });
        }

        // Continue polling
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 3000); // Poll every 3 seconds
        } else {
          setError('Generation timeout - please check history');
        }
      } catch (error) {
        console.error('Polling error:', error);
        setError('Failed to check generation status');
      }
    };

    poll();
  };

  return (
    <div className="mx-auto max-w-4xl">
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
            isGenerating={isGenerating}
            onYoutubeSubmit={handleYoutubeSubmit}
            onAudioSubmit={handleAudioSubmit}
            onTextSubmit={handleTextSubmit}
            audioFile={audioFile}
            onFileUpload={handleFileUpload}
            error={error}
            progress={progress}
          />
        </CardContent>
      </Card>
    </div>
  );
});
