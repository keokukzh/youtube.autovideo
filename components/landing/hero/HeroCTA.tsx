import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

interface HeroCTAProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  icon?: 'arrow' | 'play';
}

/**
 * Reusable CTA button component with animations and gradient effects
 */
export function HeroCTA({
  variant = 'primary',
  children,
  href,
  onClick,
  icon = 'arrow',
}: HeroCTAProps) {
  const IconComponent = icon === 'play' ? Play : ArrowRight;

  const buttonContent = (
    <Button
      size="lg"
      className={`group relative overflow-hidden px-10 py-6 text-lg font-semibold shadow-2xl transition-all duration-300 hover:scale-105 ${
        variant === 'primary'
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/25'
          : 'ring-2 ring-gray-300 hover:shadow-lg hover:ring-indigo-500'
      }`}
      onClick={onClick}
    >
      <span className="relative z-10">{children}</span>
      <IconComponent
        className={`ml-2 h-5 w-5 transition-transform duration-300 ${
          icon === 'play'
            ? 'group-hover:scale-110'
            : 'group-hover:translate-x-1'
        }`}
      />
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      )}
    </Button>
  );

  if (href) {
    return <Link href={href}>{buttonContent}</Link>;
  }

  return buttonContent;
}
