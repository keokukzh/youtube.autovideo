import React from 'react';
import { Badge } from '@/components/ui/badge';
import { HeroBackground } from './HeroBackground';
import { HeroCTA } from './HeroCTA';

/**
 * Hero section component with animated background, badge, title, and CTA buttons
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <HeroBackground />

      <div className="relative mx-auto max-w-7xl text-center">
        <Badge className="mb-6 animate-pulse bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 shadow-lg ring-1 ring-indigo-200">
          🚀 Now with AI-powered content generation
        </Badge>

        <h1 className="mb-8 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-7xl">
          Create{' '}
          <span className="animate-gradient bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            10x More Content
          </span>
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          in 10% of the Time
        </h1>

        <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-600 sm:text-2xl">
          Transform YouTube videos, podcasts, and blog posts into 10+
          ready-to-publish content formats with AI. Stop creating content from
          scratch and start repurposing like a pro.
        </p>

        <div className="flex flex-col justify-center gap-6 sm:flex-row">
          <HeroCTA href="/signup" variant="primary">
            Start Creating Now
          </HeroCTA>

          <HeroCTA variant="secondary" icon="play">
            Watch Demo
          </HeroCTA>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Free plan includes 5 credits • No credit card required
        </p>
      </div>
    </section>
  );
}
