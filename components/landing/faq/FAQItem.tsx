'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

/**
 * Expandable FAQ item with smooth animations
 */
export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="flex items-center justify-between text-lg">
          {question}
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500 transition-transform duration-200" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-200" />
          )}
        </CardTitle>
      </CardHeader>

      {isOpen && (
        <CardContent className="pt-0">
          <p className="leading-relaxed text-gray-600">{answer}</p>
        </CardContent>
      )}
    </Card>
  );
}
