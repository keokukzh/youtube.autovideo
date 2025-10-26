import { useDebounce } from '@/lib/hooks/use-debounce';

// Simple test without React Testing Library
describe('useDebounce - Simple', () => {
  it('should be a function', () => {
    expect(typeof useDebounce).toBe('function');
  });
});
