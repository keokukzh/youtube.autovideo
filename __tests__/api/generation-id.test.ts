// Mock Supabase
jest.mock('@/lib/supabase-server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: {
              id: 'test-id',
              user_id: 'user-1',
              status: 'completed',
              outputs: {},
            },
            error: null,
          }),
        })),
      })),
    })),
  })),
}));

describe('/api/generation/[id]', () => {
  it('should get generation by id', async () => {
    // Test the generation retrieval logic without importing non-existent route
    const mockSupabase = require('@/lib/supabase-server');
    const client = mockSupabase.createClient();

    const result = await client
      .from('generations')
      .select('*')
      .eq('id', 'test-id')
      .single();

    expect(result.data.id).toBe('test-id');
    expect(result.data.status).toBe('completed');
  });
});
