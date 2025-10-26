import { getUserCredits } from '@/lib/supabase';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  getUserCredits: jest.fn(),
}));

describe('Supabase', () => {
  it('should get user credits', async () => {
    const mockCredits = {
      id: 'credits-1',
      user_id: 'user-1',
      credits_remaining: 5,
      credits_total: 10,
      resets_at: '2024-02-01T00:00:00Z',
    };

    (getUserCredits as jest.Mock).mockResolvedValue(mockCredits);

    const result = await getUserCredits('user-1');

    expect(result).toEqual(mockCredits);
  });
});
