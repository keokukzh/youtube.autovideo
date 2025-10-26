import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
}

export function usePerformance(componentName: string) {
  const renderStart = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderStart.current = performance.now();
    renderCount.current += 1;

    return () => {
      const renderTime = performance.now() - renderStart.current;

      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName}:`, {
          renderTime: `${renderTime.toFixed(2)}ms`,
          renderCount: renderCount.current,
        });
      }

      // Warn about slow renders
      if (renderTime > 16) {
        // 60fps threshold
        console.warn(
          `[Performance Warning] ${componentName} took ${renderTime.toFixed(2)}ms to render`
        );
      }
    };
  });

  return {
    renderCount: renderCount.current,
  };
}
