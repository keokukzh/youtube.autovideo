import { render, screen } from '@testing-library/react';
import { UploadManager } from '@/components/dashboard/upload/UploadManager';
import { HistoryFilters } from '@/components/dashboard/history/HistoryFilters';
import { OutputCard } from '@/components/dashboard/outputs/OutputCard';

// Mock the hooks
jest.mock('@/lib/hooks/use-credits', () => ({
  useCredits: jest.fn(() => ({
    credits: 50,
    loading: false,
    error: null,
    refetch: jest.fn(),
  })),
}));

jest.mock('@/lib/hooks/use-generation-polling', () => ({
  useGenerationPolling: jest.fn(() => ({
    status: 'idle',
    progress: 0,
    message: '',
    error: null,
  })),
}));

jest.mock('@/lib/hooks/use-clipboard', () => ({
  useClipboard: jest.fn(() => ({
    copied: false,
    copyToClipboard: jest.fn(),
  })),
}));

jest.mock('@/lib/hooks/use-download', () => ({
  useDownload: jest.fn(() => ({
    downloading: false,
    downloadAsFile: jest.fn(),
  })),
}));

jest.mock('@/lib/hooks/use-debounce', () => ({
  useDebounce: jest.fn((value) => value),
}));

jest.mock('@/lib/services/GenerationService', () => ({
  GenerationService: {
    generateContent: jest.fn(),
  },
}));

/**
 * Performance testing utilities
 */
export class PerformanceTest {
  /**
   * Measure component render time
   */
  static async measureRenderTime(component: React.ReactElement): Promise<number> {
    const startTime = performance.now();
    render(component);
    const endTime = performance.now();
    return endTime - startTime;
  }

  /**
   * Measure memory usage
   */
  static measureMemoryUsage(): {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }
    return {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0,
    };
  }

  /**
   * Measure bundle size impact
   */
  static measureBundleSize(): number {
    // This would typically be done at build time
    // For testing purposes, we'll simulate it
    return Math.random() * 1000000; // Simulated bundle size in bytes
  }

  /**
   * Run performance benchmarks
   */
  static async runBenchmarks() {
    const benchmarks = {
      uploadManager: await this.measureRenderTime(<UploadManager />),
      historyFilters: await this.measureRenderTime(
        <HistoryFilters
          filters={{}}
          onFiltersChange={jest.fn()}
          onClearFilters={jest.fn()}
        />
      ),
      outputCard: await this.measureRenderTime(
        <OutputCard
          output={{
            id: 'test',
            title: 'Test Output',
            content: 'Test content',
            format: 'twitter',
            icon: 'Twitter',
          }}
          onCopy={jest.fn()}
          onDownload={jest.fn()}
        />
      ),
    };

    return benchmarks;
  }

  /**
   * Check performance thresholds
   */
  static checkPerformanceThresholds(metrics: any): {
    passed: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    const thresholds = {
      maxRenderTime: 100, // 100ms
      maxMemoryUsage: 50 * 1024 * 1024, // 50MB
      maxBundleSize: 500 * 1024, // 500KB
    };

    if (metrics.renderTime > thresholds.maxRenderTime) {
      issues.push(`Render time ${metrics.renderTime}ms exceeds threshold ${thresholds.maxRenderTime}ms`);
    }

    if (metrics.memoryUsage.usedJSHeapSize > thresholds.maxMemoryUsage) {
      issues.push(`Memory usage ${metrics.memoryUsage.usedJSHeapSize} exceeds threshold ${thresholds.maxMemoryUsage}`);
    }

    if (metrics.bundleSize > thresholds.maxBundleSize) {
      issues.push(`Bundle size ${metrics.bundleSize} exceeds threshold ${thresholds.maxBundleSize}`);
    }

    return {
      passed: issues.length === 0,
      issues,
    };
  }
}

/**
 * Performance test helpers
 */
export const performanceHelpers = {
  /**
   * Simulate heavy operations
   */
  simulateHeavyOperation: (duration: number = 1000) => {
    const start = Date.now();
    while (Date.now() - start < duration) {
      // Simulate CPU-intensive work
      Math.random();
    }
  },

  /**
   * Measure function execution time
   */
  measureFunction: <T extends (...args: any[]) => any>(
    fn: T,
    ...args: Parameters<T>
  ): { result: ReturnType<T>; executionTime: number } => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    return {
      result,
      executionTime: end - start,
    };
  },

  /**
   * Create performance report
   */
  createReport: (metrics: any) => {
    const report = {
      timestamp: new Date().toISOString(),
      metrics,
      summary: {
        totalTests: Object.keys(metrics).length,
        passed: Object.values(metrics).every((m: any) => m.passed),
      },
    };

    return report;
  },
};

/**
 * Performance test patterns
 */
export const performancePatterns = {
  /**
   * Test component mount performance
   */
  testMountPerformance: async (component: React.ReactElement) => {
    const startTime = performance.now();
    const { unmount } = render(component);
    const mountTime = performance.now() - startTime;

    const startUnmountTime = performance.now();
    unmount();
    const unmountTime = performance.now() - startUnmountTime;

    return {
      mountTime,
      unmountTime,
      totalTime: mountTime + unmountTime,
    };
  },

  /**
   * Test re-render performance
   */
  testRerenderPerformance: async (component: React.ReactElement, updates: any[]) => {
    const { rerender } = render(component);
    const times: number[] = [];

    for (const update of updates) {
      const startTime = performance.now();
      rerender(update);
      const endTime = performance.now();
      times.push(endTime - startTime);
    }

    return {
      times,
      average: times.reduce((a, b) => a + b, 0) / times.length,
      max: Math.max(...times),
      min: Math.min(...times),
    };
  },

  /**
   * Test memory leaks
   */
  testMemoryLeaks: async (component: React.ReactElement) => {
    const initialMemory = PerformanceTest.measureMemoryUsage();
    
    // Render and unmount multiple times
    for (let i = 0; i < 10; i++) {
      const { unmount } = render(component);
      unmount();
    }

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    const finalMemory = PerformanceTest.measureMemoryUsage();
    
    return {
      initialMemory,
      finalMemory,
      memoryIncrease: finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize,
      hasLeak: finalMemory.usedJSHeapSize > initialMemory.usedJSHeapSize * 1.5,
    };
  },
};
