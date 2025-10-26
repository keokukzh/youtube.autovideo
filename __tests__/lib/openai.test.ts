import { generateContent } from '@/lib/openai';

// Mock OpenAI
jest.mock('openai', () => {
  const mockOpenAI = jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  twitter_posts: ['Test tweet'],
                  linkedin_posts: ['Test LinkedIn post'],
                  instagram_captions: ['Test Instagram caption'],
                  blog_article: {
                    title: 'Test',
                    content: 'Test content',
                    word_count: 100,
                  },
                  email_newsletter: {
                    subject: 'Test',
                    content: 'Test content',
                    word_count: 100,
                  },
                  quote_graphics: ['Test quote'],
                  twitter_thread: ['Test thread'],
                  podcast_show_notes: ['Test show notes'],
                  video_script_summary: 'Test summary',
                  tiktok_hooks: ['Test hook'],
                }),
              },
            },
          ],
        }),
      },
    },
  }));

  return {
    default: mockOpenAI,
    OpenAI: mockOpenAI,
  };
});

describe('OpenAI', () => {
  it('should generate content from transcript', async () => {
    const transcript = 'This is a test transcript';

    const result = await generateContent(transcript);

    expect(result).toBeDefined();
    expect(result.twitter_posts).toHaveLength(1);
    expect(result.linkedin_posts).toHaveLength(1);
  });
});
