'use client';

import { memo, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { OutputCard } from './OutputCard';
import { OutputsExportService } from '@/lib/services/OutputsExportService';
import type { ContentOutputs } from '@/lib/types';
import {
  Twitter,
  Linkedin,
  Instagram,
  FileText,
  Mail,
  Quote,
  MessageSquare,
  Headphones,
  Video,
  Zap,
  Download,
  Loader2,
} from 'lucide-react';

interface OutputsGridProps {
  outputs: ContentOutputs;
}

/**
 * Outputs grid component
 * Displays all generated content in a grid layout
 */
export const OutputsGrid = memo(function OutputsGrid({ outputs }: OutputsGridProps) {
  const [downloadingAll, setDownloadingAll] = useState(false);

  const handleDownloadAll = useCallback(async () => {
    setDownloadingAll(true);
    try {
      await OutputsExportService.downloadZip(outputs);
    } catch (error) {
      console.error('Error downloading all outputs:', error);
    } finally {
      setDownloadingAll(false);
    }
  }, [outputs]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Generated Content
          </h2>
          <p className="text-gray-600">All 10 content formats ready for use</p>
        </div>
        <Button
          onClick={handleDownloadAll}
          disabled={downloadingAll}
          className="gradient-primary"
        >
          {downloadingAll ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Archive...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download All
            </>
          )}
        </Button>
      </div>

      {/* Output Cards Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Social Media */}
        <OutputCard
          title="Twitter Posts"
          icon={<Twitter className="h-5 w-5 text-blue-500" />}
          content={outputs.twitter_posts}
          format="280 characters each"
          isArray={true}
        />

        <OutputCard
          title="LinkedIn Posts"
          icon={<Linkedin className="h-5 w-5 text-blue-700" />}
          content={outputs.linkedin_posts}
          format="1,300 characters each"
          isArray={true}
        />

        <OutputCard
          title="Instagram Captions"
          icon={<Instagram className="h-5 w-5 text-pink-500" />}
          content={outputs.instagram_captions}
          format="2,200 characters each"
          isArray={true}
        />

        <OutputCard
          title="TikTok Hooks"
          icon={<Zap className="h-5 w-5 text-black" />}
          content={outputs.tiktok_hooks}
          format="Attention-grabbing hooks"
          isArray={true}
        />

        {/* Long Form Content */}
        <OutputCard
          title="Blog Article"
          icon={<FileText className="h-5 w-5 text-green-500" />}
          content={`Title: ${outputs.blog_article.title}\n\n${outputs.blog_article.content}`}
          format={`${outputs.blog_article.word_count} words`}
        />

        <OutputCard
          title="Email Newsletter"
          icon={<Mail className="h-5 w-5 text-orange-500" />}
          content={`Subject: ${outputs.email_newsletter.subject}\n\n${outputs.email_newsletter.content}`}
          format={`${outputs.email_newsletter.word_count} words`}
        />

        {/* Quote Graphics */}
        <OutputCard
          title="Quote Graphics"
          icon={<Quote className="h-5 w-5 text-purple-500" />}
          content={outputs.quote_graphics}
          format="Text for graphics"
          isArray={true}
        />

        {/* Thread and Show Notes */}
        <OutputCard
          title="Twitter Thread"
          icon={<MessageSquare className="h-5 w-5 text-blue-400" />}
          content={outputs.twitter_thread}
          format="Connected tweets"
          isArray={true}
        />

        <OutputCard
          title="Podcast Show Notes"
          icon={<Headphones className="h-5 w-5 text-indigo-500" />}
          content={outputs.podcast_show_notes}
          format="Bullet points"
          isArray={true}
        />

        <OutputCard
          title="Video Script Summary"
          icon={<Video className="h-5 w-5 text-red-500" />}
          content={outputs.video_script_summary}
          format="Key talking points"
        />
      </div>
    </div>
  );
});
