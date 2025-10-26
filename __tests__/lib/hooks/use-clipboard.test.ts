import { renderHook, act } from '@testing-library/react';
import { useClipboard } from '@/lib/hooks/use-clipboard';

// Mock the clipboard API
const mockWriteText = jest.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('useClipboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should copy text to clipboard successfully', async () => {
    mockWriteText.mockResolvedValue(undefined);

    const { result } = renderHook(() => useClipboard());

    expect(result.current.copied).toBe(false);

    await act(async () => {
      const success = await result.current.copyToClipboard('test text');
      expect(success).toBe(true);
    });

    expect(result.current.copied).toBe(true);
    expect(mockWriteText).toHaveBeenCalledWith('test text');

    // Fast-forward time to test reset
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.copied).toBe(false);
  });

  it('should handle clipboard errors', async () => {
    const error = new Error('Clipboard access denied');
    mockWriteText.mockRejectedValue(error);

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      const success = await result.current.copyToClipboard('test text');
      expect(success).toBe(false);
    });

    expect(result.current.copied).toBe(false);
    expect(mockWriteText).toHaveBeenCalledWith('test text');
  });

  it('should reset copied state after timeout', async () => {
    mockWriteText.mockResolvedValue(undefined);

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copyToClipboard('test text');
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.copied).toBe(false);
  });

  it('should handle multiple rapid calls', async () => {
    mockWriteText.mockResolvedValue(undefined);

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await Promise.all([
        result.current.copyToClipboard('text1'),
        result.current.copyToClipboard('text2'),
        result.current.copyToClipboard('text3'),
      ]);
    });

    expect(result.current.copied).toBe(true);
    expect(mockWriteText).toHaveBeenCalledTimes(3);
  });
});
