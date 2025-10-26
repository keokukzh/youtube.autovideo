import { renderHook, waitFor } from '@testing-library/react';
import { useCredits } from '@/lib/hooks/use-credits';

// Mock the supabase function
jest.mock('@/lib/supabase', () => ({
  getUserCredits: jest.fn(),
}));

import { getUserCredits } from '@/lib/supabase';
const mockGetUserCredits = getUserCredits as jest.MockedFunction<
  typeof getUserCredits
>;

describe('useCredits', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch credits on mount', async () => {
    const mockCredits = { credits: 50, plan: 'starter' };
    mockGetUserCredits.mockResolvedValue(mockCredits);

    const { result } = renderHook(() => useCredits('user-123'));

    expect(result.current.credits).toBe(0);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.credits).toBe(50);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    expect(mockGetUserCredits).toHaveBeenCalledWith('user-123');
  });

  it('should handle fetch error', async () => {
    const error = new Error('Failed to fetch credits');
    mockGetUserCredits.mockRejectedValue(error);

    const { result } = renderHook(() => useCredits('user-123'));

    await waitFor(() => {
      expect(result.current.credits).toBe(0);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Failed to fetch credits');
    });
  });

  it('should refetch credits when refetch is called', async () => {
    const mockCredits = { credits: 50, plan: 'starter' };
    mockGetUserCredits.mockResolvedValue(mockCredits);

    const { result } = renderHook(() => useCredits('user-123'));

    await waitFor(() => {
      expect(result.current.credits).toBe(50);
    });

    // Update mock to return different credits
    mockGetUserCredits.mockResolvedValue({ credits: 30, plan: 'starter' });

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.credits).toBe(30);
    });

    expect(mockGetUserCredits).toHaveBeenCalledTimes(2);
  });

  it('should not fetch if userId is null', () => {
    const { result } = renderHook(() => useCredits(null));

    expect(result.current.credits).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockGetUserCredits).not.toHaveBeenCalled();
  });
});
