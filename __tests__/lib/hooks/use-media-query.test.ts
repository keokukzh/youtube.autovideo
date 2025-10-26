import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from '@/lib/hooks/use-media-query';

// Mock matchMedia
const mockMatchMedia = jest.fn();
const mockAddListener = jest.fn();
const mockRemoveListener = jest.fn();

beforeEach(() => {
  mockMatchMedia.mockReturnValue({
    matches: false,
    media: '(min-width: 768px)',
    onchange: null,
    addListener: mockAddListener,
    removeListener: mockRemoveListener,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });
});

describe('useMediaQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up the mock for each test
    (window.matchMedia as jest.Mock).mockReturnValue({
      matches: false,
      media: '(min-width: 768px)',
      onchange: null,
      addListener: mockAddListener,
      removeListener: mockRemoveListener,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });
  });

  it('should return true when media query matches', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: '(min-width: 768px)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(true);
    expect(mockMatchMedia).toHaveBeenCalledWith('(min-width: 768px)');
  });

  it('should return false when media query does not match', () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(min-width: 768px)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);
  });

  it('should update when media query changes', () => {
    const mockAddListener = jest.fn();
    const mockRemoveListener = jest.fn();

    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(min-width: 768px)',
      onchange: null,
      addListener: mockAddListener,
      removeListener: mockRemoveListener,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);
    expect(mockAddListener).toHaveBeenCalled();

    // Simulate media query change
    const changeHandler = mockAddListener.mock.calls[0][0];
    act(() => {
      changeHandler({ matches: true });
    });

    expect(result.current).toBe(true);
  });

  it('should clean up listeners on unmount', () => {
    const mockAddListener = jest.fn();
    const mockRemoveListener = jest.fn();

    mockMatchMedia.mockReturnValue({
      matches: false,
      media: '(min-width: 768px)',
      onchange: null,
      addListener: mockAddListener,
      removeListener: mockRemoveListener,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(mockAddListener).toHaveBeenCalled();

    unmount();

    expect(mockRemoveListener).toHaveBeenCalled();
  });

  it('should handle SSR by returning false initially', () => {
    // Mock SSR environment
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);
  });

  it('should work with different media queries', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    const { result } = renderHook(() =>
      useMediaQuery('(prefers-color-scheme: dark)')
    );

    expect(result.current).toBe(true);
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });

  it('should handle multiple media queries', () => {
    mockMatchMedia
      .mockReturnValueOnce({
        matches: true,
        media: '(min-width: 768px)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })
      .mockReturnValueOnce({
        matches: false,
        media: '(min-width: 1024px)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      });

    const { result: result1 } = renderHook(() =>
      useMediaQuery('(min-width: 768px)')
    );
    const { result: result2 } = renderHook(() =>
      useMediaQuery('(min-width: 1024px)')
    );

    expect(result1.current).toBe(true);
    expect(result2.current).toBe(false);
  });
});
