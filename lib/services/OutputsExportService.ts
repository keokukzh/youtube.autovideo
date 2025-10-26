import type { ContentOutputs } from '@/lib/types';

interface ExportFile {
  content: string;
  filename: string;
}

/**
 * Service class for handling content exports
 * Handles ZIP file creation and individual file downloads
 */
export class OutputsExportService {
  /**
   * Create export files from content outputs
   */
  static createExportFiles(outputs: ContentOutputs): ExportFile[] {
    const files: ExportFile[] = [];

    // Add Twitter posts
    outputs.twitter_posts.forEach((post, index) => {
      files.push({
        content: post,
        filename: `twitter-posts/twitter-post-${index + 1}.txt`,
      });
    });

    // Add LinkedIn posts
    outputs.linkedin_posts.forEach((post, index) => {
      files.push({
        content: post,
        filename: `linkedin-posts/linkedin-post-${index + 1}.txt`,
      });
    });

    // Add Instagram captions
    outputs.instagram_captions.forEach((caption, index) => {
      files.push({
        content: caption,
        filename: `instagram-captions/instagram-caption-${index + 1}.txt`,
      });
    });

    // Add blog article
    files.push({
      content: `Title: ${outputs.blog_article.title}\n\n${outputs.blog_article.content}`,
      filename: `blog-article/blog-article.txt`,
    });

    // Add email newsletter
    files.push({
      content: `Subject: ${outputs.email_newsletter.subject}\n\n${outputs.email_newsletter.content}`,
      filename: `email-newsletter/email-newsletter.txt`,
    });

    // Add quote graphics
    outputs.quote_graphics.forEach((quote, index) => {
      files.push({
        content: quote,
        filename: `quote-graphics/quote-${index + 1}.txt`,
      });
    });

    // Add Twitter thread
    outputs.twitter_thread.forEach((tweet, index) => {
      files.push({
        content: tweet,
        filename: `twitter-thread/tweet-${index + 1}.txt`,
      });
    });

    // Add podcast show notes
    outputs.podcast_show_notes.forEach((note, index) => {
      files.push({
        content: note,
        filename: `podcast-show-notes/show-note-${index + 1}.txt`,
      });
    });

    // Add video script summary
    files.push({
      content: outputs.video_script_summary,
      filename: `video-script-summary/script-summary.txt`,
    });

    // Add TikTok hooks
    outputs.tiktok_hooks.forEach((hook, index) => {
      files.push({
        content: hook,
        filename: `tiktok-hooks/hook-${index + 1}.txt`,
      });
    });

    return files;
  }

  /**
   * Create ZIP file from content outputs
   */
  static async createZipFile(outputs: ContentOutputs, zipName: string = 'contentmultiplier-outputs.zip'): Promise<Blob> {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    const files = this.createExportFiles(outputs);
    
    // Add all files to zip
    files.forEach(({ content, filename }) => {
      zip.file(filename, content);
    });

    // Generate zip file
    return await zip.generateAsync({ type: 'blob' });
  }

  /**
   * Download ZIP file
   */
  static async downloadZip(outputs: ContentOutputs, zipName: string = 'contentmultiplier-outputs.zip'): Promise<void> {
    try {
      const zipBlob = await this.createZipFile(outputs, zipName);
      const url = URL.createObjectURL(zipBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = zipName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating ZIP file:', error);
      throw new Error('Failed to create ZIP file');
    }
  }

  /**
   * Download individual file
   */
  static downloadFile(content: string, filename: string): void {
    try {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error('Failed to download file');
    }
  }
}
