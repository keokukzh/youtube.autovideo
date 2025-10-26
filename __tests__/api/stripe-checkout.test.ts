import { NextRequest } from 'next/server';
import { POST } from '@/app/api/stripe/checkout/route';

// Mock dependencies
jest.mock('@/lib/supabase-server', () => ({
  getCurrentUser: jest.fn(),
}));

jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      update: jest.fn().mockReturnThis(),
    })),
  },
}));

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    customers: {
      create: jest.fn(),
    },
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
  }));
});

describe('/api/stripe/checkout', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  };

  const mockProfile = {
    stripe_customer_id: null,
    email: 'test@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 when user is not authenticated', async () => {
    const { getCurrentUser } = require('@/lib/supabase-server');
    getCurrentUser.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ tier: 'STARTER' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 for invalid tier', async () => {
    const { getCurrentUser } = require('@/lib/supabase-server');
    getCurrentUser.mockResolvedValue(mockUser);

    const request = new NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ tier: 'INVALID' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid tier');
  });

  it('should create checkout session for valid tier', async () => {
    const { getCurrentUser } = require('@/lib/supabase-server');
    const { supabaseAdmin } = require('@/lib/supabase');
    const Stripe = require('stripe');

    getCurrentUser.mockResolvedValue(mockUser);
    supabaseAdmin.from().select().eq().single.mockResolvedValue({ data: mockProfile });

    const mockStripe = new Stripe();
    mockStripe.customers.create.mockResolvedValue({ id: 'cus_test123' });
    mockStripe.checkout.sessions.create.mockResolvedValue({ url: 'https://checkout.stripe.com/test' });

    const request = new NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ tier: 'STARTER' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.url).toBe('https://checkout.stripe.com/test');
    expect(mockStripe.customers.create).toHaveBeenCalledWith({
      email: 'test@example.com',
      metadata: { supabase_user_id: 'test-user-id' },
    });
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith({
      customer: 'cus_test123',
      line_items: [{ price: process.env.STRIPE_PRICE_ID_STARTER, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { user_id: 'test-user-id', tier: 'STARTER' },
    });
  });

  it('should use existing customer ID if available', async () => {
    const { getCurrentUser } = require('@/lib/supabase-server');
    const { supabaseAdmin } = require('@/lib/supabase');
    const Stripe = require('stripe');

    getCurrentUser.mockResolvedValue(mockUser);
    supabaseAdmin.from().select().eq().single.mockResolvedValue({ 
      data: { ...mockProfile, stripe_customer_id: 'cus_existing123' } 
    });

    const mockStripe = new Stripe();
    mockStripe.checkout.sessions.create.mockResolvedValue({ url: 'https://checkout.stripe.com/test' });

    const request = new NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ tier: 'PRO' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.url).toBe('https://checkout.stripe.com/test');
    expect(mockStripe.customers.create).not.toHaveBeenCalled();
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith({
      customer: 'cus_existing123',
      line_items: [{ price: process.env.STRIPE_PRICE_ID_PRO, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { user_id: 'test-user-id', tier: 'PRO' },
    });
  });

  it('should handle Stripe API errors', async () => {
    const { getCurrentUser } = require('@/lib/supabase-server');
    const { supabaseAdmin } = require('@/lib/supabase');
    const Stripe = require('stripe');

    getCurrentUser.mockResolvedValue(mockUser);
    supabaseAdmin.from().select().eq().single.mockResolvedValue({ data: mockProfile });

    const mockStripe = new Stripe();
    mockStripe.customers.create.mockRejectedValue(new Error('Stripe API error'));

    const request = new NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ tier: 'STARTER' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Stripe API error');
  });

  it('should handle missing user email', async () => {
    const { getCurrentUser } = require('@/lib/supabase-server');
    const { supabaseAdmin } = require('@/lib/supabase');
    const Stripe = require('stripe');

    getCurrentUser.mockResolvedValue({ ...mockUser, email: null });
    supabaseAdmin.from().select().eq().single.mockResolvedValue({ data: { ...mockProfile, email: null } });

    const mockStripe = new Stripe();
    mockStripe.customers.create.mockResolvedValue({ id: 'cus_test123' });
    mockStripe.checkout.sessions.create.mockResolvedValue({ url: 'https://checkout.stripe.com/test' });

    const request = new NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ tier: 'STARTER' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(mockStripe.customers.create).toHaveBeenCalledWith({
      email: 'no-email@example.com',
      metadata: { supabase_user_id: 'test-user-id' },
    });
  });

  it('should handle all valid tiers', async () => {
    const { getCurrentUser } = require('@/lib/supabase-server');
    const { supabaseAdmin } = require('@/lib/supabase');
    const Stripe = require('stripe');

    getCurrentUser.mockResolvedValue(mockUser);
    supabaseAdmin.from().select().eq().single.mockResolvedValue({ data: mockProfile });

    const mockStripe = new Stripe();
    mockStripe.customers.create.mockResolvedValue({ id: 'cus_test123' });
    mockStripe.checkout.sessions.create.mockResolvedValue({ url: 'https://checkout.stripe.com/test' });

    const tiers = ['STARTER', 'PRO', 'TEAM'];
    
    for (const tier of tiers) {
      const request = new NextRequest('http://localhost:3000/api/stripe/checkout', {
        method: 'POST',
        body: JSON.stringify({ tier }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    }
  });

  it('should update user with new customer ID', async () => {
    const { getCurrentUser } = require('@/lib/supabase-server');
    const { supabaseAdmin } = require('@/lib/supabase');
    const Stripe = require('stripe');

    getCurrentUser.mockResolvedValue(mockUser);
    supabaseAdmin.from().select().eq().single.mockResolvedValue({ data: mockProfile });

    const mockStripe = new Stripe();
    mockStripe.customers.create.mockResolvedValue({ id: 'cus_new123' });
    mockStripe.checkout.sessions.create.mockResolvedValue({ url: 'https://checkout.stripe.com/test' });

    const request = new NextRequest('http://localhost:3000/api/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ tier: 'STARTER' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(supabaseAdmin.from().update).toHaveBeenCalledWith({
      stripe_customer_id: 'cus_new123',
    });
  });
});
