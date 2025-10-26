'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Youtube, Upload, FileText } from 'lucide-react';
import { YoutubeUploadForm } from './YoutubeUploadForm';
import { AudioUploadForm } from './AudioUploadForm';
import { TextUploadForm } from './TextUploadForm';

interface UploadTabsProps {
  isGenerating: boolean;
  onYoutubeSubmit: (data: { url: string }) => Promise<void>;
  onAudioSubmit: () => Promise<void>;
  onTextSubmit: (data: { text: string }) => Promise<void>;
  audioFile: File | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  progress: any;
}

export function UploadTabs({
  isGenerating,
  onYoutubeSubmit,
  onAudioSubmit,
  onTextSubmit,
  audioFile,
  onFileUpload,
  error,
  progress,
}: UploadTabsProps) {
  return (
    <Tabs defaultValue="youtube" className="w-full">
      <TabsList className="grid w-full grid-cols-3 rounded-lg bg-gray-100 p-1">
        <TabsTrigger
          value="youtube"
          className="flex items-center space-x-2 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          disabled={isGenerating}
        >
          <Youtube className="h-4 w-4" />
          <span className="hidden sm:inline">YouTube URL</span>
          <span className="sm:hidden">YouTube</span>
        </TabsTrigger>
        <TabsTrigger
          value="audio"
          className="flex items-center space-x-2 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          disabled={isGenerating}
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Audio Upload</span>
          <span className="sm:hidden">Audio</span>
        </TabsTrigger>
        <TabsTrigger
          value="text"
          className="flex items-center space-x-2 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          disabled={isGenerating}
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Paste Text</span>
          <span className="sm:hidden">Text</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="youtube" className="mt-6">
        <YoutubeUploadForm
          onSubmit={onYoutubeSubmit}
          isGenerating={isGenerating}
          error={error}
          progress={progress}
        />
      </TabsContent>

      <TabsContent value="audio" className="mt-6">
        <AudioUploadForm
          onSubmit={onAudioSubmit}
          onFileUpload={onFileUpload}
          audioFile={audioFile}
          isGenerating={isGenerating}
          error={error}
          progress={progress}
        />
      </TabsContent>

      <TabsContent value="text" className="mt-6">
        <TextUploadForm
          onSubmit={onTextSubmit}
          isGenerating={isGenerating}
          error={error}
          progress={progress}
        />
      </TabsContent>
    </Tabs>
  );
}
