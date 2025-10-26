import OpenAI from 'openai';
import type { ContentOutputs } from './types';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate content using OpenAI with retry logic
 */
export async function generateWithRetry(
  prompt: string,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are a professional content repurposing expert. Generate high-quality, engaging content in the requested format. Always respond with valid JSON when requested.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content generated');
      }

      return content;
    } catch (error) {
      lastError = error as Error;
      console.error(`OpenAI API attempt ${attempt} failed:`, error);

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw new Error(
    `OpenAI API failed after ${maxRetries} attempts: ${lastError?.message}`
  );
}

/**
 * Transcribe audio using OpenAI Whisper
 */
export async function transcribeAudio(
  audioBuffer: Buffer,
  filename: string
): Promise<string> {
  try {
    const file = new File([audioBuffer as BlobPart], filename, {
      type: 'audio/mpeg',
    });

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'en',
    });

    return transcription.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio file');
  }
}

/**
 * Generate social media content (Twitter, LinkedIn, Instagram)
 */
export async function generateSocialMediaContent(transcript: string): Promise<{
  twitter_posts: string[];
  linkedin_posts: string[];
  instagram_captions: string[];
}> {
  const prompt = `
Generate social media content from this transcript. Return a JSON object with the following structure:

{
  "twitter_posts": [
    "5 Twitter posts, each exactly 280 characters or less. Include 2-3 relevant hashtags. Make them engaging with hooks and calls-to-action.",
    ...
  ],
  "linkedin_posts": [
    "3 LinkedIn posts, each up to 1,300 characters. Professional tone, include personal insights, use emojis strategically.",
    ...
  ],
  "instagram_captions": [
    "2 Instagram captions, each up to 2,200 characters. Engaging tone, include relevant hashtags, make them shareable.",
    ...
  ]
}

TRANSCRIPT:
${transcript}

Return only the JSON object, no additional text.`;

  const response = await generateWithRetry(prompt);

  try {
    return JSON.parse(response);
  } catch (error) {
    console.error('Error parsing social media content:', error);
    throw new Error('Failed to parse social media content');
  }
}

/**
 * Generate long-form content (Blog article, Email newsletter)
 */
export async function generateLongFormContent(transcript: string): Promise<{
  blog_article: { title: string; content: string; word_count: number };
  email_newsletter: { subject: string; content: string; word_count: number };
}> {
  const prompt = `
Generate long-form content from this transcript. Return a JSON object with the following structure:

{
  "blog_article": {
    "title": "SEO-optimized title (60 characters or less)",
    "content": "1,500-2,500 word blog article with H2 headings, intro, conclusion, and actionable insights. Use markdown formatting.",
    "word_count": 0
  },
  "email_newsletter": {
    "subject": "Compelling subject line (50 characters or less)",
    "content": "500-word email newsletter with personal touch, actionable tips, and clear call-to-action.",
    "word_count": 0
  }
}

TRANSCRIPT:
${transcript}

Return only the JSON object, no additional text.`;

  const response = await generateWithRetry(prompt);

  try {
    const parsed = JSON.parse(response);

    // Calculate word counts
    parsed.blog_article.word_count =
      parsed.blog_article.content.split(/\s+/).length;
    parsed.email_newsletter.word_count =
      parsed.email_newsletter.content.split(/\s+/).length;

    return parsed;
  } catch (error) {
    console.error('Error parsing long-form content:', error);
    throw new Error('Failed to parse long-form content');
  }
}

/**
 * Generate quotes and hooks
 */
export async function generateQuotesAndHooks(transcript: string): Promise<{
  quote_graphics: string[];
  tiktok_hooks: string[];
}> {
  const prompt = `
Generate quotes and hooks from this transcript. Return a JSON object with the following structure:

{
  "quote_graphics": [
    "5 powerful, quotable statements from the content. Each should be 1-2 sentences, impactful, and shareable. No quotation marks needed.",
    ...
  ],
  "tiktok_hooks": [
    "5 TikTok/Reels hook ideas that would grab attention in the first 3 seconds. Make them engaging, curiosity-driven, and platform-appropriate.",
    ...
  ]
}

TRANSCRIPT:
${transcript}

Return only the JSON object, no additional text.`;

  const response = await generateWithRetry(prompt);

  try {
    return JSON.parse(response);
  } catch (error) {
    console.error('Error parsing quotes and hooks:', error);
    throw new Error('Failed to parse quotes and hooks');
  }
}

/**
 * Generate thread and show notes
 */
export async function generateThreadAndShowNotes(transcript: string): Promise<{
  twitter_thread: string[];
  podcast_show_notes: string[];
  video_script_summary: string;
}> {
  const prompt = `
Generate thread and show notes from this transcript. Return a JSON object with the following structure:

{
  "twitter_thread": [
    "8-12 connected tweets that tell a story or explain a concept. Each tweet should be under 280 characters and flow naturally to the next.",
    ...
  ],
  "podcast_show_notes": [
    "Bullet-point show notes with key topics, timestamps (if applicable), and actionable takeaways. Format as a list.",
    ...
  ],
  "video_script_summary": "Key talking points and main themes from the content, formatted as a structured summary with bullet points."
}

TRANSCRIPT:
${transcript}

Return only the JSON object, no additional text.`;

  const response = await generateWithRetry(prompt);

  try {
    return JSON.parse(response);
  } catch (error) {
    console.error('Error parsing thread and show notes:', error);
    throw new Error('Failed to parse thread and show notes');
  }
}

/**
 * Generate all content formats
 */
export async function generateAllContent(
  transcript: string
): Promise<ContentOutputs> {
  try {
    // Generate all content in parallel for better performance
    const [socialMedia, longForm, quotesAndHooks, threadAndShowNotes] =
      await Promise.all([
        generateSocialMediaContent(transcript),
        generateLongFormContent(transcript),
        generateQuotesAndHooks(transcript),
        generateThreadAndShowNotes(transcript),
      ]);

    return {
      ...socialMedia,
      ...longForm,
      ...quotesAndHooks,
      ...threadAndShowNotes,
    };
  } catch (error) {
    console.error('Error generating all content:', error);
    throw new Error('Failed to generate content');
  }
}
