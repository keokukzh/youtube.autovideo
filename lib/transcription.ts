import { YoutubeTranscript } from 'youtube-transcript';
import { transcribeAudio } from './openai';
import { extractYouTubeId, isValidYouTubeUrl } from './utils';
import { supabaseAdmin } from './supabase';
import crypto from 'crypto';

/**
 * Get transcript from YouTube video using free youtube-transcript package
 */
export async function getYouTubeTranscript(url: string): Promise<string> {
  try {
    if (!isValidYouTubeUrl(url)) {
      throw new Error('Invalid YouTube URL');
    }

    const videoId = extractYouTubeId(url);
    if (!videoId) {
      throw new Error('Could not extract video ID from URL');
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    if (!transcript || transcript.length === 0) {
      throw new Error('No transcript available for this video');
    }

    // Combine all transcript segments into a single text
    const fullTranscript = transcript
      .map((segment) => segment.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (fullTranscript.length < 100) {
      throw new Error('Transcript too short - video may not have captions');
    }

    return fullTranscript;
  } catch (error) {
    console.error('Error getting YouTube transcript:', error);

    if (error instanceof Error) {
      if (error.message.includes('Transcript is disabled')) {
        throw new Error('This video has captions disabled');
      }
      if (error.message.includes('Video unavailable')) {
        throw new Error('Video is unavailable or private');
      }
      if (error.message.includes('No transcript available')) {
        throw new Error('No transcript available for this video');
      }
    }

    throw new Error('Failed to get transcript from YouTube video');
  }
}

/**
 * Transcribe audio file using OpenAI Whisper API
 */
export async function transcribeAudioFile(file: File): Promise<string> {
  try {
    // Validate file type
    const allowedTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/m4a',
      'audio/mp4',
    ];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        'Unsupported audio format. Please use MP3, WAV, or M4A files.'
      );
    }

    // Validate file size (max 25MB for Whisper API)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      throw new Error('File too large. Please use files smaller than 25MB.');
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Transcribe using OpenAI Whisper
    const transcript = await transcribeAudio(buffer, file.name);

    if (!transcript || transcript.length < 50) {
      throw new Error('Audio transcription failed or returned empty result');
    }

    return transcript;
  } catch (error) {
    console.error('Error transcribing audio file:', error);

    if (error instanceof Error) {
      if (error.message.includes('File too large')) {
        throw new Error('File too large. Please use files smaller than 25MB.');
      }
      if (error.message.includes('Unsupported audio format')) {
        throw new Error(
          'Unsupported audio format. Please use MP3, WAV, or M4A files.'
        );
      }
    }

    throw new Error('Failed to transcribe audio file');
  }
}

/**
 * Get transcript with caching (SAVES MONEY)
 */
export async function getTranscriptWithCache(
  sourceType: 'youtube' | 'text',
  source: string
): Promise<string> {
  const sourceIdentifier =
    sourceType === 'youtube'
      ? extractYouTubeId(source)
      : crypto
          .createHash('sha256')
          .update(source)
          .digest('hex')
          .substring(0, 32);

  if (!sourceIdentifier) {
    throw new Error('Invalid source');
  }

  // Check cache first
  const { data: cached } = await supabaseAdmin
    .from('transcript_cache')
    .select('transcript, id, access_count')
    .eq('source_type', sourceType)
    .eq('source_identifier', sourceIdentifier)
    .single();

  if (cached) {
    // Update access stats
    await supabaseAdmin
      .from('transcript_cache')
      .update({
        accessed_at: new Date().toISOString(),
        access_count: cached.access_count + 1,
      })
      .eq('id', cached.id);

    return cached.transcript;
  }

  // Fetch fresh transcript
  let transcript: string;

  if (sourceType === 'youtube') {
    if (!isValidYouTubeUrl(source)) {
      throw new Error('Invalid YouTube URL');
    }

    const videoId = extractYouTubeId(source);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);

    if (!transcriptData || transcriptData.length === 0) {
      throw new Error('No transcript available for this video');
    }

    transcript = transcriptData
      .map((segment) => segment.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  } else {
    transcript = source.trim();
  }

  // Validate
  if (transcript.length < 100) {
    throw new Error('Transcript too short');
  }

  // Cache for future use
  await supabaseAdmin.from('transcript_cache').insert({
    source_type: sourceType,
    source_identifier: sourceIdentifier,
    transcript,
    word_count: transcript.split(' ').length,
  });

  return transcript;
}

/**
 * Get transcript based on input type
 */
export async function getTranscript(
  inputType: 'youtube' | 'audio' | 'text',
  inputUrl?: string,
  inputText?: string,
  audioFile?: File
): Promise<string> {
  switch (inputType) {
    case 'youtube':
      if (!inputUrl) {
        throw new Error('YouTube URL is required');
      }
      return await getYouTubeTranscript(inputUrl);

    case 'audio':
      if (!audioFile) {
        throw new Error('Audio file is required');
      }
      return await transcribeAudioFile(audioFile);

    case 'text':
      if (!inputText || inputText.trim().length < 100) {
        throw new Error('Text input must be at least 100 characters');
      }
      return inputText.trim();

    default:
      throw new Error('Invalid input type');
  }
}

/**
 * Validate transcript quality
 */
export function validateTranscript(transcript: string): {
  isValid: boolean;
  error?: string;
} {
  if (!transcript || transcript.length < 100) {
    return { isValid: false, error: 'Transcript too short' };
  }

  if (transcript.length > 100000) {
    return { isValid: false, error: 'Transcript too long' };
  }

  // Check for common issues
  if (transcript.includes('[Music]') && transcript.length < 500) {
    return { isValid: false, error: 'Transcript appears to be mostly music' };
  }

  if (transcript.split(' ').length < 50) {
    return { isValid: false, error: 'Transcript has too few words' };
  }

  return { isValid: true };
}
