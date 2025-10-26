import React, { memo } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  popular?: boolean;
  variant?: 'default' | 'popular';
}

/**
 * Reusable pricing card component with popular variant styling
 */
export const PricingCard = memo(function PricingCard({
  title,
  price,
  period,
  description,
  features,
  ctaText,
  ctaHref,
  popular = false,
  variant = 'default',
}: PricingCardProps) {
  const isPopular = popular || variant === 'popular';

  return (
    <Card
      className={`group relative ${
        isPopular
          ? 'border-2 border-indigo-500 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/20'
          : 'transition-all duration-300 hover:scale-105'
      }`}
    >
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 animate-pulse bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
          Most Popular
        </Badge>
      )}

      <CardHeader className="text-center">
        <CardTitle
          className={`${isPopular ? 'text-2xl font-bold text-gray-900' : 'text-xl'}`}
        >
          {title}
        </CardTitle>
        <div className="mt-4">
          <span
            className={`${isPopular ? 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent' : 'text-4xl font-bold'}`}
          >
            ${price}
          </span>
          <span className="text-gray-500">/{period}</span>
        </div>
        <CardDescription className={isPopular ? 'text-gray-600' : ''}>
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className={`space-y-${isPopular ? '6' : '4'}`}>
        <ul className={`space-y-${isPopular ? '3' : '2'}`}>
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check
                className={`${isPopular ? 'mr-3 h-5 w-5' : 'mr-2 h-4 w-4'} text-green-500`}
              />
              <span
                className={`${isPopular ? 'text-sm font-medium' : 'text-sm'}`}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <Link href={ctaHref}>
          <Button
            className={`w-full ${
              isPopular
                ? 'group/btn relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold shadow-lg transition-all duration-300 hover:shadow-indigo-500/25'
                : 'gradient-primary'
            }`}
          >
            {isPopular ? (
              <>
                <span className="relative z-10">{ctaText}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"></div>
              </>
            ) : (
              ctaText
            )}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
});
