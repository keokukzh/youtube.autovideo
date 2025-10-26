import React from 'react';
import { TestimonialCard } from './TestimonialCard';

/**
 * Testimonials section with customer reviews
 */
export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "This tool has completely transformed my content strategy. I can now create a week's worth of content in just 30 minutes!",
      author: 'Sarah Johnson',
      role: 'Content Creator',
      gradientFrom: 'yellow',
      gradientTo: 'orange',
      quoteColor: 'text-yellow-400',
      hoverShadowColor: 'yellow',
    },
    {
      quote:
        "The quality of the generated content is incredible. It's like having a professional copywriter on my team 24/7.",
      author: 'Mike Chen',
      role: 'Marketing Director',
      gradientFrom: 'blue',
      gradientTo: 'blue',
      quoteColor: 'text-blue-400',
      hoverShadowColor: 'blue',
    },
    {
      quote:
        'Our agency has increased our content output by 10x while maintaining quality. This is a game-changer for our business.',
      author: 'Emily Rodriguez',
      role: 'Agency Owner',
      gradientFrom: 'purple',
      gradientTo: 'pink',
      quoteColor: 'text-purple-400',
      hoverShadowColor: 'purple',
    },
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Loved by Content Creators
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            See what our users are saying about ContentMultiplier.io
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              gradientFrom={testimonial.gradientFrom}
              gradientTo={testimonial.gradientTo}
              quoteColor={testimonial.quoteColor}
              hoverShadowColor={testimonial.hoverShadowColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
