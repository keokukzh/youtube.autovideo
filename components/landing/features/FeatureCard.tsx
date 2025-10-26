import React, { memo } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
  hoverShadowColor: string;
}

/**
 * Reusable feature card with hover lift effect and gradient styling
 */
export const FeatureCard = memo(function FeatureCard({
  icon: Icon,
  title,
  description,
  gradientFrom,
  gradientTo,
  iconColor,
  hoverShadowColor,
}: FeatureCardProps) {
  return (
    <Card
      className={`group relative overflow-hidden border-0 bg-gradient-to-br from-white to-${gradientFrom}-50/20 text-center shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-${hoverShadowColor}-500/20`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br from-${gradientFrom}-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      ></div>
      <CardHeader className="relative">
        <div
          className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-${gradientFrom}-100 to-${gradientTo}-200 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-${hoverShadowColor}-500/25`}
        >
          <Icon
            className={`h-8 w-8 ${iconColor} transition-transform duration-300 group-hover:scale-110`}
          />
        </div>
        <CardTitle className="text-xl font-bold text-gray-900">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
});
