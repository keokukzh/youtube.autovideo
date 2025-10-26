import React from 'react';
import { Zap, Target, Users, Shield, Clock, DollarSign } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

/**
 * Grid of feature cards showcasing key benefits
 */
export function FeaturesGrid() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description:
        'Generate 10+ content formats in under 5 minutes. No more spending hours on content creation.',
      gradientFrom: 'indigo',
      gradientTo: 'indigo',
      iconColor: 'text-indigo-600',
      hoverShadowColor: 'indigo',
    },
    {
      icon: Target,
      title: 'Platform Optimized',
      description:
        'Each format is optimized for its platform - Twitter posts, LinkedIn articles, Instagram captions, and more.',
      gradientFrom: 'purple',
      gradientTo: 'purple',
      iconColor: 'text-purple-600',
      hoverShadowColor: 'purple',
    },
    {
      icon: Users,
      title: 'Team Ready',
      description:
        'Perfect for content teams, agencies, and solo creators who want to scale their content production.',
      gradientFrom: 'pink',
      gradientTo: 'pink',
      iconColor: 'text-pink-600',
      hoverShadowColor: 'pink',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description:
        'Your content is processed securely and never shared with third parties. Full data privacy guaranteed.',
      gradientFrom: 'green',
      gradientTo: 'green',
      iconColor: 'text-green-600',
      hoverShadowColor: 'green',
    },
    {
      icon: Clock,
      title: '24/7 Available',
      description:
        'Generate content anytime, anywhere. No waiting for business hours or human writers.',
      gradientFrom: 'orange',
      gradientTo: 'orange',
      iconColor: 'text-orange-600',
      hoverShadowColor: 'orange',
    },
    {
      icon: DollarSign,
      title: 'Cost Effective',
      description:
        'Save thousands on content creation costs. One credit generates 10+ pieces of content.',
      gradientFrom: 'blue',
      gradientTo: 'blue',
      iconColor: 'text-blue-600',
      hoverShadowColor: 'blue',
    },
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Why ContentMultiplier.io?
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Built for creators who want to scale their content without
            sacrificing quality or spending endless hours writing.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradientFrom={feature.gradientFrom}
              gradientTo={feature.gradientTo}
              iconColor={feature.iconColor}
              hoverShadowColor={feature.hoverShadowColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
