'use client';

import { memo } from 'react';
import { OutputsGrid } from './outputs/OutputsGrid';
import type { ContentOutputs } from '@/lib/types';

interface OutputDisplayProps {
  outputs: ContentOutputs;
}

/**
 * Output display component
 * Now uses the refactored OutputsGrid for better separation of concerns
 */
export const OutputDisplay = memo(function OutputDisplay({
  outputs,
}: OutputDisplayProps) {
  return <OutputsGrid outputs={outputs} />;
});
