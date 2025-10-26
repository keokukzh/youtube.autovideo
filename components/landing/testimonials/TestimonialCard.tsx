import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  gradientFrom: string;
  gradientTo: string;
  quoteColor: string;
  hoverShadowColor: string;
}

/**
 * Reusable testimonial card with star rating and gradient styling
 */
export function TestimonialCard({
  quote,
  author,
  role,
  gradientFrom,
  gradientTo,
  quoteColor,
  hoverShadowColor,
}: TestimonialCardProps) {
  return (
    <Card
      className={`group relative overflow-hidden border-0 bg-gradient-to-br from-white to-${gradientFrom}-50/20 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-${hoverShadowColor}-500/10`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br from-${gradientFrom}-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      ></div>
      <CardContent className="relative p-8">
        <div className="mb-6 flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="h-6 w-6 fill-yellow-400 text-yellow-400 transition-transform duration-300 group-hover:scale-110"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>

        <blockquote className="mb-6 text-lg text-gray-700">
          <span className={`text-4xl ${quoteColor}`}>"</span>
          {quote}
          <span className={`text-4xl ${quoteColor}`}>"</span>
        </blockquote>

        <div className="flex items-center">
          <div
            className={`mr-4 h-12 w-12 rounded-full bg-gradient-to-br from-${gradientFrom}-400 to-${gradientTo}-500 shadow-lg`}
          ></div>
          <div>
            <p className="font-bold text-gray-900">{author}</p>
            <p className="text-sm text-gray-600">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
