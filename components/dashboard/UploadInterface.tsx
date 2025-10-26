'use client';

import { memo } from 'react';
import { UploadManager } from './upload/UploadManager';

/**
 * Upload interface component
 * Now uses the refactored UploadManager for better separation of concerns
 */
export const UploadInterface = memo(function UploadInterface() {
  return <UploadManager />;
});
