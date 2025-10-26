'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
  });

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      process.env.NODE_ENV !== 'development'
    ) {
      return;
    }

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              setMetrics((prev) => ({ ...prev, fcp: entry.startTime }));
            }
            break;
          case 'largest-contentful-paint':
            setMetrics((prev) => ({ ...prev, lcp: entry.startTime }));
            break;
          case 'first-input':
            setMetrics((prev) => ({
              ...prev,
              fid:
                (entry as PerformanceEventTiming).processingStart -
                entry.startTime,
            }));
            break;
          case 'layout-shift':
            if (
              !(entry as PerformanceEntry & { hadRecentInput?: boolean })
                .hadRecentInput
            ) {
              setMetrics((prev) => ({
                ...prev,
                cls:
                  (prev.cls || 0) +
                  (entry as PerformanceEntry & { value: number }).value,
              }));
            }
            break;
        }
      }
    });

    try {
      observer.observe({
        entryTypes: [
          'paint',
          'largest-contentful-paint',
          'first-input',
          'layout-shift',
        ],
      });
    } catch (e) {
      // Performance monitoring not supported in this environment
      if (process.env.NODE_ENV === 'development') {
        console.warn('Performance monitoring not supported:', e);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-black/80 p-3 text-xs text-white backdrop-blur-sm">
      <div className="mb-2 font-semibold">Performance</div>
      <div className="space-y-1">
        <div>FCP: {metrics.fcp ? `${metrics.fcp.toFixed(0)}ms` : '...'}</div>
        <div>LCP: {metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : '...'}</div>
        <div>FID: {metrics.fid ? `${metrics.fid.toFixed(0)}ms` : '...'}</div>
        <div>CLS: {metrics.cls ? metrics.cls.toFixed(3) : '...'}</div>
      </div>
    </div>
  );
}
