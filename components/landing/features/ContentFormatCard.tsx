import React, { memo } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ContentFormatCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
  hoverShadowColor: string;
}

/**
 * Reusable content format card with hover effects and gradient styling
 */
export const ContentFormatCard = memo(function ContentFormatCard({
  icon: Icon,
  title,
  description,
  gradientFrom,
  gradientTo,
  iconColor,
  hoverShadowColor,
}: ContentFormatCardProps) {
  return (
    <Card
      className={`group relative overflow-hidden border-0 bg-gradient-to-br from-white to-${gradientFrom}-50/30 text-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-${hoverShadowColor}-500/10`}
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
