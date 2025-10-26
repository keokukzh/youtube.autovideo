import { renderHook, waitFor, act } from '@testing-library/react';
import { useGenerationPolling } from '@/lib/hooks/use-generation-polling';

// Mock the GenerationService
jest.mock('@/lib/services/GenerationService', () => ({
  GenerationService: {
    getGenerationStatus: jest.fn(),
  },
}));

import { GenerationService } from '@/lib/services/GenerationService';

const mockGetGenerationStatus =
  GenerationService.getGenerationStatus as jest.MockedFunction<
    typeof GenerationService.getGenerationStatus
  >;

describe('useGenerationPolling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should start polling when generationId is provided', async () => {
    const mockStatus = {
      id: 'gen-123',
      status: 'processing',
      progress: 50,
      message: 'Generating content...',
    };
    mockGetGenerationStatus.mockResolvedValue(mockStatus);

    const { result } = renderHook(() => useGenerationPolling('gen-123'));

    expect(result.current.status).toBe('processing');
    expect(result.current.progress).toBe(0);
    expect(result.current.message).toBe('Starting generation...');
    expect(result.current.error).toBeNull();

    // Fast-forward time to trigger polling
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.status).toBe('processing');
      expect(result.current.progress).toBe(50);
      expect(result.current.message).toBe('Generating content...');
    });

    expect(mockGetGenerationStatus).toHaveBeenCalledWith('gen-123');
  });

  it('should stop polling when generation is complete', async () => {
    const mockStatus = {
      id: 'gen-123',
      status: 'completed',
      progress: 100,
      message: 'Generation complete',
    };
    mockGetGenerationStatus.mockResolvedValue(mockStatus);

    const { result } = renderHook(() => useGenerationPolling('gen-123'));

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.status).toBe('completed');
      expect(result.current.progress).toBe(100);
      expect(result.current.message).toBe('Generation complete');
    });

    // Advance time again to ensure polling stopped
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Should only be called once since generation is complete
    expect(mockGetGenerationStatus).toHaveBeenCalledTimes(1);
  });

  it('should handle polling errors', async () => {
    const error = new Error('Failed to fetch status');
    mockGetGenerationStatus.mockRejectedValue(error);

    const { result } = renderHook(() => useGenerationPolling('gen-123'));

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to fetch status');
    });
  });

  it('should stop polling when generationId changes', async () => {
    const { result, rerender } = renderHook(
      ({ generationId }) => useGenerationPolling(generationId),
      { initialProps: { generationId: 'gen-123' } }
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Change generationId
    rerender({ generationId: 'gen-456' });

    // Should reset state
    expect(result.current.status).toBe('processing');
    expect(result.current.progress).toBe(0);
    expect(result.current.message).toBe('Starting generation...');
    expect(result.current.error).toBeNull();
  });

  it('should stop polling when generationId is null', () => {
    const { result } = renderHook(() => useGenerationPolling(null));

    expect(result.current.status).toBe('idle');
    expect(result.current.progress).toBe(0);
    expect(result.current.message).toBe('');
    expect(result.current.error).toBeNull();

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(mockGetGenerationStatus).not.toHaveBeenCalled();
  });
});
