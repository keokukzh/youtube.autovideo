/**
 * OpenAI client for Cloudflare Workers
 */

import OpenAI from 'openai';
import type { Env } from '../types';

export function createOpenAIClient(env: Env) {
  return new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
}

export async function generateContent(
  openai: OpenAI,
  prompt: string,
  maxTokens: number = 2000
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a content repurposing expert. Generate high-quality, engaging content based on the provided input.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate content');
  }
}

export async function transcribeAudio(
  openai: OpenAI,
  audioBuffer: ArrayBuffer
): Promise<string> {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: new File([audioBuffer], 'audio.mp3', { type: 'audio/mpeg' }),
      model: 'whisper-1',
    });

    return transcription.text;
  } catch (error) {
    console.error('OpenAI transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

export function createContentPrompts(inputText: string) {
  return {
    twitter: `Create 5 engaging Twitter posts based on this content: ${inputText}`,
    linkedin: `Create 3 professional LinkedIn posts based on this content: ${inputText}`,
    instagram: `Create 2 Instagram captions with hashtags based on this content: ${inputText}`,
    blog: `Create a comprehensive blog article based on this content: ${inputText}`,
    email: `Create an email newsletter based on this content: ${inputText}`,
    quotes: `Extract 5 powerful quotes from this content: ${inputText}`,
    thread: `Create a Twitter thread based on this content: ${inputText}`,
    podcast: `Create podcast show notes based on this content: ${inputText}`,
    summary: `Create a video script summary based on this content: ${inputText}`,
    hooks: `Create 5 TikTok/Reels hooks based on this content: ${inputText}`,
  };
}
