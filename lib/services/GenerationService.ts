import type { GenerationRequest, ApiResponse } from '@/lib/types';

interface GenerationServiceResponse {
  generation_id: string;
  status: string;
}

/**
 * Service class for handling content generation API calls
 * Follows Single Responsibility Principle - only handles generation logic
 */
export class GenerationService {
  /**
   * Generate content from various input types
   */
  static async generateContent(
    inputType: 'youtube' | 'audio' | 'text',
    data: any
  ): Promise<ApiResponse<GenerationServiceResponse>> {
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

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Generation service error:', error);
      throw error;
    }
  }

  /**
   * Check generation status
   */
  static async checkGenerationStatus(
    generationId: string
  ): Promise<ApiResponse<{ status: string; progress?: number; error?: string }>> {
    try {
      const response = await fetch(`/api/generation/${generationId}`);
      
      if (!response.ok) {
        throw new Error('Failed to check generation status');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Status check error:', error);
      throw error;
    }
  }

  /**
   * Validate file before upload
   */
  static validateFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/m4a',
      'audio/mp4',
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Please upload an MP3, WAV, or M4A file',
      };
    }

    // Validate file size (25MB max for Whisper API)
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File too large. Please use files smaller than 25MB',
      };
    }

    return { valid: true };
  }

  /**
   * Validate YouTube URL
   */
  static validateYouTubeUrl(url: string): { valid: boolean; error?: string } {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
    
    if (!youtubeRegex.test(url)) {
      return {
        valid: false,
        error: 'Please enter a valid YouTube URL',
      };
    }

    return { valid: true };
  }

  /**
   * Validate text input
   */
  static validateTextInput(text: string): { valid: boolean; error?: string } {
    if (!text.trim()) {
      return {
        valid: false,
        error: 'Please enter some text',
      };
    }

    if (text.length < 10) {
      return {
        valid: false,
        error: 'Text must be at least 10 characters long',
      };
    }

    if (text.length > 50000) {
      return {
        valid: false,
        error: 'Text must be less than 50,000 characters',
      };
    }

    return { valid: true };
  }
}
