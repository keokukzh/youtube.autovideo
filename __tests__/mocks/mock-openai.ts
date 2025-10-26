import type { ContentOutputs } from '@/lib/types';

/**
 * Mock OpenAI client for testing
 */

export const mockOpenAIClient = {
  chat: {
    completions: {
      create: jest.fn(),
    },
  },
  audio: {
    transcriptions: {
      create: jest.fn(),
    },
  },
};

// Mock responses
export const mockOpenAIResponses = {
  // Chat completions
  chat: {
    success: {
      choices: [
        {
          message: {
            content: JSON.stringify({
              twitter_posts: [
                "🚀 Just discovered an amazing productivity hack! Here's how to 10x your output... #productivity #hacks",
                "💡 The secret to consistent content creation isn't talent - it's systems. Here's what I learned...",
              ],
              linkedin_posts: [
                "The future of content creation isn't about working harder - it's about working smarter...",
              ],
              instagram_captions: [
                "🚀 The secret to 10x content creation isn't working harder - it's working smarter!...",
              ],
                  blog_article: {
                    title: 'The Future of Content Creation',
                    content: 'How AI-Powered Repurposing is Changing the Game...',
                    word_count: 1500,
                  },
                  email_newsletter: {
                    subject: 'The Content Creation Hack That Changed Everything',
                    content: 'Here\'s what I learned about content repurposing...',
                    word_count: 800,
                  },
              quote_graphics: [
                "The future of content creation isn't about working harder - it's about working smarter.",
                'One piece of content can become 10+ different formats when you know how to repurpose effectively.',
              ],
              twitter_thread: [
                '🧵 The biggest content creation myth: "More content = more growth."...',
                '2/ Most creators spend 80% of their time on content production...',
              ],
              podcast_show_notes:
                '# Episode Title: The Future of Content Creation...',
              video_script_summary:
                '## Video Script Summary: The Future of Content Creation...',
              tiktok_hooks: [
                'POV: You discover the content creation hack that changes everything...',
                'This AI tool just saved me 10 hours of work...',
              ],
            }),
          },
        },
      ],
      usage: {
        prompt_tokens: 1000,
        completion_tokens: 500,
        total_tokens: 1500,
      },
    },
    error: {
      error: {
        message: 'OpenAI API error',
        type: 'api_error',
        code: 'rate_limit_exceeded',
      },
    },
  },

  // Audio transcriptions
  audio: {
    success: {
      text: 'This is a test transcription of the audio content. It contains multiple sentences and should be processed correctly by the AI system.',
    },
    error: {
      error: {
        message: 'Audio transcription failed',
        type: 'invalid_request_error',
        code: 'invalid_file_format',
      },
    },
  },
};

// Mock content generation functions
export const mockContentGeneration = {
  generateAllContent: jest.fn(),
  generateSocialMediaContent: jest.fn(),
  generateLongFormContent: jest.fn(),
  generateQuotesAndHooks: jest.fn(),
  generateThreadAndShowNotes: jest.fn(),
  transcribeAudio: jest.fn(),
  generateWithRetry: jest.fn(),
};

// Mock content outputs
export const mockGeneratedContent: ContentOutputs = {
  twitter_posts: [
    "🚀 Just discovered an amazing productivity hack! Here's how to 10x your output... #productivity #hacks",
    "💡 The secret to consistent content creation isn't talent - it's systems. Here's what I learned...",
    "📈 Want to grow your audience? Stop creating content from scratch. Here's the repurposing strategy that changed everything...",
    "🎯 The biggest mistake content creators make? Not repurposing their best content. Here's how to fix it...",
    '⚡ From 1 piece of content to 10+ formats in minutes. This AI tool is a game-changer for creators...',
  ],
  linkedin_posts: [
    "The future of content creation isn't about working harder - it's about working smarter. After analyzing thousands of successful content strategies, I've discovered that the most effective creators don't create more content; they repurpose their best content more effectively.\n\nHere's what I learned:\n\n1. One piece of high-quality content can generate 10+ different formats\n2. Each platform has unique optimization requirements\n3. AI can handle the technical repurposing while you focus on strategy\n\nThis approach has helped me scale my content production by 10x while maintaining quality. What's your content repurposing strategy?",
    "Content creation is evolving. The creators who will thrive in 2024 aren't those who can write the most content, but those who can extract maximum value from their best ideas.\n\nI've been experimenting with AI-powered content repurposing, and the results are incredible. One YouTube video can become:\n\n• 5 Twitter posts\n• 3 LinkedIn articles\n• 2 Instagram captions\n• 1 blog post\n• 1 email newsletter\n• And more...\n\nThe key is maintaining your unique voice while optimizing for each platform. How are you adapting your content strategy?",
    "The biggest content creation myth: \"More content = more growth.\"\n\nReality: Better content + smart repurposing = sustainable growth.\n\nI've seen creators burn out trying to create fresh content daily. The solution isn't working harder - it's working smarter.\n\nHere's my framework:\n\n1. Create one high-quality piece of content\n2. Extract key insights and quotes\n3. Adapt for different platforms and audiences\n4. Maintain consistency in your voice\n\nThis approach has helped me maintain quality while scaling production. What's your take on content repurposing?",
  ],
  instagram_captions: [
    "🚀 The secret to 10x content creation isn't working harder - it's working smarter! \n\nOne piece of content can become 10+ different formats when you know how to repurpose effectively. \n\nFrom YouTube videos to Twitter threads, blog posts to Instagram captions - the possibilities are endless when you have the right system in place.\n\nStop creating content from scratch and start maximizing the value of your best ideas! 💡\n\n#ContentCreation #Productivity #ContentStrategy #CreatorLife #DigitalMarketing #ContentRepurposing #SocialMediaMarketing #ContentMarketing #ProductivityHacks #ContentCreator",
    "💡 Content creation hack: Stop starting from zero every time!\n\nYour best content already exists - you just need to repurpose it effectively. \n\nOne YouTube video can become:\n• 5 Twitter posts\n• 3 LinkedIn articles\n• 2 Instagram captions\n• 1 blog post\n• 1 email newsletter\n• And so much more!\n\nThe key is maintaining your unique voice while optimizing for each platform's audience and format requirements.\n\nReady to transform your content strategy? 🎯\n\n#ContentRepurposing #ContentStrategy #ProductivityHacks #ContentCreation #DigitalMarketing #SocialMediaMarketing #ContentMarketing #CreatorLife #Productivity #ContentHacks",
  ],
  blog_article: {
    title: 'The Future of Content Creation: How AI-Powered Repurposing is Changing the Game',
    content: "## Introduction\n\nIn today's fast-paced digital landscape, content creators face an unprecedented challenge: producing high-quality content consistently across multiple platforms while maintaining their unique voice and brand identity. The traditional approach of creating fresh content for each platform is not only time-consuming but also unsustainable for most creators.\n\n## The Problem with Traditional Content Creation\n\nMost content creators spend 80% of their time on content production and only 20% on strategy and engagement. This imbalance leads to:\n\n- Creator burnout\n- Inconsistent quality\n- Limited reach across platforms\n- Reduced time for audience engagement\n\n## The Solution: AI-Powered Content Repurposing\n\nAI-powered content repurposing represents a paradigm shift in how we approach content creation. Instead of creating content from scratch for each platform, creators can now:\n\n1. **Create once, publish everywhere**: Transform one piece of content into 10+ platform-optimized formats\n2. **Maintain consistency**: Ensure your brand voice remains consistent across all platforms\n3. **Scale efficiently**: Increase content output without sacrificing quality\n4. **Focus on strategy**: Spend more time on audience engagement and business growth\n\n## The Technical Implementation\n\nModern AI systems can analyze content structure, extract key insights, and adapt messaging for different platforms while maintaining the original intent and voice. This process involves:\n\n- **Content analysis**: Understanding the core message and key points\n- **Platform optimization**: Adapting format, tone, and length for each platform\n- **Voice preservation**: Maintaining the creator's unique style and personality\n- **Quality assurance**: Ensuring accuracy and relevance across all formats\n\n## Real-World Impact\n\nContent creators who have adopted AI-powered repurposing report:\n\n- 10x increase in content output\n- 50% reduction in content creation time\n- Improved consistency across platforms\n- Higher engagement rates due to platform-optimized content\n\n## The Future of Content Creation\n\nAs AI technology continues to evolve, we can expect even more sophisticated content repurposing capabilities. The future belongs to creators who can leverage technology to amplify their unique voice and ideas, not replace them.\n\n## Conclusion\n\nAI-powered content repurposing isn't about replacing human creativity - it's about amplifying it. By automating the technical aspects of content adaptation, creators can focus on what they do best: connecting with their audience and sharing valuable insights.\n\nThe question isn't whether AI will change content creation - it's whether you'll be ready to adapt and thrive in this new landscape.",
    word_count: 1500,
  },
  email_newsletter: {
    subject: 'The Content Creation Hack That Changed Everything',
    content: "Hi there,\n\nI want to share something that completely transformed my content strategy.\n\nFor years, I struggled with the same problem every content creator faces: how do you create enough high-quality content to stay relevant across all platforms without burning out?\n\nI tried everything:\n- Hiring more writers\n- Working longer hours\n- Reducing content quality\n- Focusing on fewer platforms\n\nNothing worked. Until I discovered AI-powered content repurposing.\n\nHere's what changed:\n\nInstead of creating 10 different pieces of content, I now create 1 high-quality piece and let AI transform it into 10+ platform-optimized formats.\n\nOne YouTube video becomes:\n• 5 Twitter posts\n• 3 LinkedIn articles\n• 2 Instagram captions\n• 1 blog post\n• 1 email newsletter\n• And more...\n\nThe result? I've increased my content output by 10x while actually reducing my workload.\n\nBut here's the key: the AI doesn't replace my voice - it amplifies it. Every piece of repurposed content maintains my unique style and perspective.\n\nIf you're struggling with content creation, I highly recommend exploring AI-powered repurposing tools. They're not just a productivity hack - they're a game-changer for sustainable content creation.\n\nWhat's your biggest content creation challenge? Reply and let me know - I'd love to help.\n\nBest,\n[Your Name]\n\nP.S. If you want to see this in action, check out my latest YouTube video where I walk through my entire content repurposing workflow.",
    word_count: 800,
  },
  quote_graphics: [
    "The future of content creation isn't about working harder - it's about working smarter.",
    'One piece of content can become 10+ different formats when you know how to repurpose effectively.',
    'Stop creating content from scratch and start maximizing the value of your best ideas.',
    "AI doesn't replace human creativity - it amplifies it.",
    "The creators who will thrive aren't those who can write the most content, but those who can extract maximum value from their best ideas.",
  ],
  twitter_thread: [
    '🧵 The biggest content creation myth: "More content = more growth."\n\nReality: Better content + smart repurposing = sustainable growth.\n\nHere\'s what I learned after analyzing 1000+ successful creators:',
    '2/ Most creators spend 80% of their time on content production and only 20% on strategy and engagement.\n\nThis imbalance leads to:\n• Creator burnout\n• Inconsistent quality\n• Limited reach across platforms\n• Reduced time for audience engagement',
    "3/ The solution isn't working harder - it's working smarter.\n\nInstead of creating content from scratch for each platform, successful creators:\n\n• Create one high-quality piece\n• Extract key insights and quotes\n• Adapt for different platforms\n• Maintain consistency in their voice",
    "4/ Here's my framework for content repurposing:\n\n1. Create one high-quality piece of content\n2. Extract key insights and quotes\n3. Adapt for different platforms and audiences\n4. Maintain consistency in your voice\n\nThis approach has helped me maintain quality while scaling production.",
    "5/ The key is maintaining your unique voice while optimizing for each platform's audience and format requirements.\n\nAI can handle the technical repurposing while you focus on strategy and engagement.",
    '6/ Content creators who have adopted AI-powered repurposing report:\n\n• 10x increase in content output\n• 50% reduction in content creation time\n• Improved consistency across platforms\n• Higher engagement rates due to platform-optimized content',
    "7/ The future belongs to creators who can leverage technology to amplify their unique voice and ideas, not replace them.\n\nAI-powered content repurposing isn't about replacing human creativity - it's about amplifying it.",
    "8/ By automating the technical aspects of content adaptation, creators can focus on what they do best: connecting with their audience and sharing valuable insights.\n\nThe question isn't whether AI will change content creation - it's whether you'll be ready to adapt and thrive.",
    "9/ If you're struggling with content creation, I highly recommend exploring AI-powered repurposing tools.\n\nThey're not just a productivity hack - they're a game-changer for sustainable content creation.\n\nWhat's your biggest content creation challenge? Let me know in the replies! 👇",
    "10/ That's a wrap! If you found this thread valuable:\n\n• Follow me for more content creation insights\n• Retweet the first tweet to share with others\n• Check out my latest YouTube video for a deep dive into my content repurposing workflow\n\nThanks for reading! 🙏",
  ],
  podcast_show_notes: [
    '# Episode Title: The Future of Content Creation',
    '## Key Takeaways',
    '• Content creators spend 80% of their time on production and only 20% on strategy',
    '• AI-powered repurposing can increase content output by 10x',
    '• The key is maintaining your unique voice while optimizing for each platform',
    '• Successful creators focus on creating once and publishing everywhere',
    '## Timestamps',
    '[00:00] Introduction and the content creation challenge',
    '[02:30] The problem with traditional content creation approaches',
    '[05:45] How AI-powered repurposing works',
    '[08:20] Real-world examples and case studies',
    '[12:15] The technical implementation and best practices',
    '[15:30] Future trends and what to expect',
    '[18:00] Q&A and audience questions',
    '[20:00] Conclusion and next steps',
    '## Resources Mentioned',
    '• ContentMultiplier.io - AI-powered content repurposing tool',
    '• YouTube video on content repurposing workflow',
    '• Blog post on sustainable content creation',
    '## Connect with the Host',
    '• Twitter: @yourhandle',
    '• LinkedIn: /in/yourprofile',
    '• Website: yourwebsite.com',
    '## Subscribe and Review',
    'If you enjoyed this episode, please subscribe and leave a review on your favorite podcast platform. Your feedback helps us reach more creators and continue producing valuable content.',
  ],
  video_script_summary:
    "## Video Script Summary: The Future of Content Creation\n\n### Main Theme\nAI-powered content repurposing and its impact on sustainable content creation\n\n### Key Points\n\n1. **The Content Creation Challenge**\n   - Most creators struggle with consistent, high-quality content across platforms\n   - Traditional approaches lead to burnout and inconsistent quality\n   - Need for a more sustainable approach to content creation\n\n2. **The Problem with Current Approaches**\n   - 80% of time spent on content production vs 20% on strategy\n   - Creating fresh content for each platform is time-consuming\n   - Limited reach and reduced time for audience engagement\n\n3. **The AI-Powered Solution**\n   - Transform one piece of content into 10+ platform-optimized formats\n   - Maintain consistency in brand voice across platforms\n   - Scale content output without sacrificing quality\n   - Focus more time on strategy and audience engagement\n\n4. **Technical Implementation**\n   - Content analysis to understand core message\n   - Platform optimization for format, tone, and length\n   - Voice preservation to maintain creator's unique style\n   - Quality assurance for accuracy and relevance\n\n5. **Real-World Impact**\n   - 10x increase in content output\n   - 50% reduction in content creation time\n   - Improved consistency across platforms\n   - Higher engagement rates due to platform optimization\n\n6. **Future Outlook**\n   - AI will continue to evolve and improve\n   - Creators who adapt will thrive\n   - Technology amplifies human creativity rather than replacing it\n\n### Call to Action\nEncourage viewers to explore AI-powered repurposing tools and share their content creation challenges for discussion.",
  tiktok_hooks: [
    'POV: You discover the content creation hack that changes everything...',
    'This AI tool just saved me 10 hours of work...',
    'The secret to 10x content creation that nobody talks about...',
    "I tried AI content repurposing for 30 days and here's what happened...",
    'Why I stopped creating content from scratch (and you should too)...',
  ],
};

// Helper functions to set up mocks
export const setupMockOpenAI = () => {
  jest.mock('@/lib/openai', () => mockContentGeneration);
};

export const mockOpenAIGeneration = (content: ContentOutputs) => {
  mockContentGeneration.generateAllContent.mockResolvedValue(content);
  mockContentGeneration.generateSocialMediaContent.mockResolvedValue({
    twitter_posts: content.twitter_posts,
    linkedin_posts: content.linkedin_posts,
    instagram_captions: content.instagram_captions,
  });
  mockContentGeneration.generateLongFormContent.mockResolvedValue({
    blog_article: content.blog_article,
    email_newsletter: content.email_newsletter,
  });
  mockContentGeneration.generateQuotesAndHooks.mockResolvedValue({
    quote_graphics: content.quote_graphics,
    tiktok_hooks: content.tiktok_hooks,
  });
  mockContentGeneration.generateThreadAndShowNotes.mockResolvedValue({
    twitter_thread: content.twitter_thread,
    podcast_show_notes: content.podcast_show_notes,
    video_script_summary: content.video_script_summary,
  });
};

export const mockOpenAITranscription = (text: string) => {
  mockContentGeneration.transcribeAudio.mockResolvedValue(text);
};

export const mockOpenAIError = (error: string) => {
  mockContentGeneration.generateAllContent.mockRejectedValue(new Error(error));
  mockContentGeneration.transcribeAudio.mockRejectedValue(new Error(error));
};
