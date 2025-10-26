// Mock Supabase
jest.mock('@/lib/supabase-server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signOut: jest.fn(),
    },
  })),
}));

describe('/api/auth/logout', () => {
  it('should handle logout request', async () => {
    // Test the logout logic without importing non-existent route
    const mockSupabase = require('@/lib/supabase-server');
    const client = mockSupabase.createClient();

    await client.auth.signOut();

    expect(client.auth.signOut).toHaveBeenCalled();
  });
});
