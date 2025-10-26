'use client';

import { useState, memo, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Copy,
  Download,
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
  Check,
  Loader2,
} from 'lucide-react';
import { copyToClipboard, downloadAsFile, truncateText } from '@/lib/utils';
import type { ContentOutputs } from '@/lib/types';
import JSZip from 'jszip';

interface OutputDisplayProps {
  outputs: ContentOutputs;
}

interface OutputCardProps {
  title: string;
  icon: React.ReactNode;
  content: string | string[];
  format: string;
  onCopy: (content: string) => void;
  onDownload: (content: string, filename: string) => void;
  isArray?: boolean;
}

const OutputCard = memo(function OutputCard({
  title,
  icon,
  content,
  format,
  onCopy,
  onDownload,
  isArray = false,
}: OutputCardProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopy = useCallback(
    async (contentToCopy: string) => {
      await onCopy(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    [onCopy]
  );

  const handleDownload = useCallback(
    async (contentToDownload: string, filename: string) => {
      setDownloading(true);
      await onDownload(contentToDownload, filename);
      setDownloading(false);
    },
    [onDownload]
  );

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
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(item)}
                    disabled={copied}
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
                    onClick={() =>
                      handleDownload(
                        item,
                        `${title.toLowerCase().replace(/\s+/g, '-')}-${index + 1}.txt`
                      )
                    }
                    disabled={downloading}
                  >
                    {downloading ? (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    ) : (
                      <Download className="mr-1 h-3 w-3" />
                    )}
                    Download
                  </Button>
                </div>
              </div>
            )}
            <div className="rounded-md bg-gray-50 p-3">
              <p className="whitespace-pre-wrap text-sm text-gray-700">
                {truncateText(item, 300)}
              </p>
              {item.length > 300 && (
                <p className="mt-2 text-xs text-gray-500">
                  {item.length} characters • Click copy/download for full
                  content
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
});

export const OutputDisplay = memo(function OutputDisplay({
  outputs,
}: OutputDisplayProps) {
  const [downloadingAll, setDownloadingAll] = useState(false);

  const handleCopy = useCallback(async (content: string): Promise<boolean> => {
    return await copyToClipboard(content);
  }, []);

  const handleDownload = useCallback(
    async (content: string, filename: string): Promise<void> => {
      downloadAsFile(content, filename);
    },
    []
  );

  const handleDownloadAll = useCallback(async () => {
    setDownloadingAll(true);

    try {
      const zip = new JSZip();

      // Add Twitter posts
      outputs.twitter_posts.forEach((post, index) => {
        zip.file(`twitter-posts/twitter-post-${index + 1}.txt`, post);
      });

      // Add LinkedIn posts
      outputs.linkedin_posts.forEach((post, index) => {
        zip.file(`linkedin-posts/linkedin-post-${index + 1}.txt`, post);
      });

      // Add Instagram captions
      outputs.instagram_captions.forEach((caption, index) => {
        zip.file(
          `instagram-captions/instagram-caption-${index + 1}.txt`,
          caption
        );
      });

      // Add blog article
      zip.file(
        `blog-article/blog-article.txt`,
        `Title: ${outputs.blog_article.title}\n\n${outputs.blog_article.content}`
      );

      // Add email newsletter
      zip.file(
        `email-newsletter/email-newsletter.txt`,
        `Subject: ${outputs.email_newsletter.subject}\n\n${outputs.email_newsletter.content}`
      );

      // Add quote graphics
      outputs.quote_graphics.forEach((quote, index) => {
        zip.file(`quote-graphics/quote-${index + 1}.txt`, quote);
      });

      // Add Twitter thread
      outputs.twitter_thread.forEach((tweet, index) => {
        zip.file(`twitter-thread/tweet-${index + 1}.txt`, tweet);
      });

      // Add podcast show notes
      outputs.podcast_show_notes.forEach((note, index) => {
        zip.file(`podcast-show-notes/show-note-${index + 1}.txt`, note);
      });

      // Add video script summary
      zip.file(
        `video-script-summary/script-summary.txt`,
        outputs.video_script_summary
      );

      // Add TikTok hooks
      outputs.tiktok_hooks.forEach((hook, index) => {
        zip.file(`tiktok-hooks/hook-${index + 1}.txt`, hook);
      });

      // Generate and download zip
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'contentmultiplier-outputs.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating zip file:', error);
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
          onCopy={handleCopy}
          onDownload={handleDownload}
          isArray={true}
        />

        <OutputCard
          title="LinkedIn Posts"
          icon={<Linkedin className="h-5 w-5 text-blue-700" />}
          content={outputs.linkedin_posts}
          format="1,300 characters each"
          onCopy={handleCopy}
          onDownload={handleDownload}
          isArray={true}
        />

        <OutputCard
          title="Instagram Captions"
          icon={<Instagram className="h-5 w-5 text-pink-500" />}
          content={outputs.instagram_captions}
          format="2,200 characters each"
          onCopy={handleCopy}
          onDownload={handleDownload}
          isArray={true}
        />

        <OutputCard
          title="TikTok Hooks"
          icon={<Zap className="h-5 w-5 text-black" />}
          content={outputs.tiktok_hooks}
          format="Attention-grabbing hooks"
          onCopy={handleCopy}
          onDownload={handleDownload}
          isArray={true}
        />

        {/* Long Form Content */}
        <OutputCard
          title="Blog Article"
          icon={<FileText className="h-5 w-5 text-green-500" />}
          content={`Title: ${outputs.blog_article.title}\n\n${outputs.blog_article.content}`}
          format={`${outputs.blog_article.word_count} words`}
          onCopy={handleCopy}
          onDownload={handleDownload}
        />

        <OutputCard
          title="Email Newsletter"
          icon={<Mail className="h-5 w-5 text-orange-500" />}
          content={`Subject: ${outputs.email_newsletter.subject}\n\n${outputs.email_newsletter.content}`}
          format={`${outputs.email_newsletter.word_count} words`}
          onCopy={handleCopy}
          onDownload={handleDownload}
        />

        {/* Quote Graphics */}
        <OutputCard
          title="Quote Graphics"
          icon={<Quote className="h-5 w-5 text-purple-500" />}
          content={outputs.quote_graphics}
          format="Text for graphics"
          onCopy={handleCopy}
          onDownload={handleDownload}
          isArray={true}
        />

        {/* Thread and Show Notes */}
        <OutputCard
          title="Twitter Thread"
          icon={<MessageSquare className="h-5 w-5 text-blue-400" />}
          content={outputs.twitter_thread}
          format="Connected tweets"
          onCopy={handleCopy}
          onDownload={handleDownload}
          isArray={true}
        />

        <OutputCard
          title="Podcast Show Notes"
          icon={<Headphones className="h-5 w-5 text-indigo-500" />}
          content={outputs.podcast_show_notes}
          format="Bullet points"
          onCopy={handleCopy}
          onDownload={handleDownload}
          isArray={true}
        />

        <OutputCard
          title="Video Script Summary"
          icon={<Video className="h-5 w-5 text-red-500" />}
          content={outputs.video_script_summary}
          format="Key talking points"
          onCopy={handleCopy}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
});
