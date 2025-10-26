import React from 'react';
import { PricingCard } from './PricingCard';

/**
 * Pricing section with all four pricing tiers
 */
export function PricingSection() {
  const pricingTiers = [
    {
      title: 'Free',
      price: 0,
      period: 'month',
      description: 'Perfect for trying out the platform',
      features: [
        '5 credits per month',
        'All 10 content formats',
        'Basic support',
      ],
      ctaText: 'Get Started Free',
      ctaHref: '/signup',
      variant: 'default' as const,
    },
    {
      title: 'Starter',
      price: 39,
      period: 'month',
      description: 'Great for individual creators',
      features: [
        '50 credits per month',
        'All 10 content formats',
        'Priority support',
        'Content history',
      ],
      ctaText: 'Start Starter Plan',
      ctaHref: '/signup',
      variant: 'default' as const,
    },
    {
      title: 'Pro',
      price: 99,
      period: 'month',
      description: 'Perfect for content teams',
      features: [
        '200 credits per month',
        'All 10 content formats',
        'Priority support',
        'Advanced analytics',
        'Bulk export',
      ],
      ctaText: 'Start Pro Plan',
      ctaHref: '/signup',
      variant: 'popular' as const,
    },
    {
      title: 'Team',
      price: 199,
      period: 'month',
      description: 'For agencies and large teams',
      features: [
        '500 credits per month',
        'All 10 content formats',
        'Team collaboration',
        'White-label options',
        'Dedicated support',
      ],
      ctaText: 'Contact Sales',
      ctaHref: '/signup',
      variant: 'default' as const,
    },
  ];

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Choose the plan that fits your content creation needs. All plans
            include access to all 10 content formats.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {pricingTiers.map((tier, index) => (
            <PricingCard
              key={index}
              title={tier.title}
              price={tier.price}
              period={tier.period}
              description={tier.description}
              features={tier.features}
              ctaText={tier.ctaText}
              ctaHref={tier.ctaHref}
              variant={tier.variant}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
