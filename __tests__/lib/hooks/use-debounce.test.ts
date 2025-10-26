import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/lib/hooks/use-debounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Change value multiple times quickly
    rerender({ value: 'first', delay: 500 });
    rerender({ value: 'second', delay: 500 });
    rerender({ value: 'third', delay: 500 });

    // Value should still be initial
    expect(result.current).toBe('initial');

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value should now be the last one
    expect(result.current).toBe('third');
  });

  it('should handle different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    );

    rerender({ value: 'changed', delay: 1000 });

    // Should not update yet
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Still should not update
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now should update
    expect(result.current).toBe('changed');
  });

  it('should reset timer when value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'first', delay: 500 });

    // Fast-forward part of the delay
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Change value again
    rerender({ value: 'second', delay: 500 });

    // Fast-forward the remaining time from first change
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Should still be initial because timer was reset
    expect(result.current).toBe('initial');

    // Fast-forward the full delay from second change
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now should be second
    expect(result.current).toBe('second');
  });

  it('should handle delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'changed', delay: 1000 });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should not update yet with new delay
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now should update
    expect(result.current).toBe('changed');
  });

  it('should work with different value types', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 100 } }
    );

    rerender({ value: 1, delay: 100 });
    rerender({ value: 2, delay: 100 });
    rerender({ value: 3, delay: 100 });

    expect(result.current).toBe(0);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBe(3);
  });

  it('should handle null and undefined values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: null, delay: 100 } }
    );

    rerender({ value: undefined, delay: 100 });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBeUndefined();
  });
});
