import React from 'react';
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
} from 'lucide-react';
import { ContentFormatCard } from './ContentFormatCard';

/**
 * Grid of content format cards showcasing all 10 generated formats
 */
export function ContentFormatsGrid() {
  const contentFormats = [
    {
      icon: Twitter,
      title: '5 Twitter Posts',
      description: '280 characters each with hashtags and engagement hooks',
      gradientFrom: 'blue',
      gradientTo: 'blue',
      iconColor: 'text-blue-600',
      hoverShadowColor: 'blue',
    },
    {
      icon: Linkedin,
      title: '3 LinkedIn Posts',
      description: 'Professional tone, 1,300 characters with insights',
      gradientFrom: 'blue',
      gradientTo: 'blue',
      iconColor: 'text-blue-700',
      hoverShadowColor: 'blue',
    },
    {
      icon: Instagram,
      title: '2 Instagram Captions',
      description: 'Engaging tone, 2,200 characters with hashtags',
      gradientFrom: 'pink',
      gradientTo: 'pink',
      iconColor: 'text-pink-500',
      hoverShadowColor: 'pink',
    },
    {
      icon: FileText,
      title: '1 Blog Article',
      description: '1,500-2,500 words with SEO optimization',
      gradientFrom: 'green',
      gradientTo: 'green',
      iconColor: 'text-green-500',
      hoverShadowColor: 'green',
    },
    {
      icon: Mail,
      title: '1 Email Newsletter',
      description: 'Subject line + 500-word engaging content',
      gradientFrom: 'orange',
      gradientTo: 'orange',
      iconColor: 'text-orange-500',
      hoverShadowColor: 'orange',
    },
    {
      icon: Quote,
      title: '5 Quote Graphics',
      description: 'Powerful quotes ready for Canva or design tools',
      gradientFrom: 'purple',
      gradientTo: 'purple',
      iconColor: 'text-purple-500',
      hoverShadowColor: 'purple',
    },
    {
      icon: MessageSquare,
      title: '1 Twitter Thread',
      description: '8-12 connected tweets telling a story',
      gradientFrom: 'cyan',
      gradientTo: 'cyan',
      iconColor: 'text-cyan-500',
      hoverShadowColor: 'cyan',
    },
    {
      icon: Headphones,
      title: '1 Podcast Show Notes',
      description: 'Bullet points with timestamps and key takeaways',
      gradientFrom: 'indigo',
      gradientTo: 'indigo',
      iconColor: 'text-indigo-500',
      hoverShadowColor: 'indigo',
    },
    {
      icon: Video,
      title: '1 Video Script Summary',
      description: 'Key talking points and main themes',
      gradientFrom: 'red',
      gradientTo: 'red',
      iconColor: 'text-red-500',
      hoverShadowColor: 'red',
    },
    {
      icon: Zap,
      title: '5 TikTok/Reels Hooks',
      description: 'Attention-grabbing hooks for short-form video',
      gradientFrom: 'gray',
      gradientTo: 'gray',
      iconColor: 'text-white',
      hoverShadowColor: 'gray',
    },
  ];

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            10 Content Formats from One Input
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Our AI transforms your content into platform-optimized formats that
            are ready to publish immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {contentFormats.map((format, index) => (
            <ContentFormatCard
              key={index}
              icon={format.icon}
              title={format.title}
              description={format.description}
              gradientFrom={format.gradientFrom}
              gradientTo={format.gradientTo}
              iconColor={format.iconColor}
              hoverShadowColor={format.hoverShadowColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
