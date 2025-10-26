import { NextRequest } from 'next/server';
import { POST } from '@/app/api/stripe/webhook/route';

// Mock dependencies
jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn(() => ({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  },
}));

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: jest.fn(),
    },
  }));
});

describe('/api/stripe/webhook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle checkout.session.completed event', async () => {
    const { supabaseAdmin } = require('@/lib/supabase');
    const Stripe = require('stripe');

    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: {
            user_id: 'test-user-id',
            tier: 'STARTER',
          },
        },
      },
    };

    const mockStripe = new Stripe();
    mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

    const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'test-signature',
      },
      body: 'test-body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(supabaseAdmin.from).toHaveBeenCalledWith('users');
    expect(supabaseAdmin.from).toHaveBeenCalledWith('credits');
  });

  it('should handle customer.subscription.updated event', async () => {
    const { supabaseAdmin } = require('@/lib/supabase');
    const Stripe = require('stripe');

    const mockEvent = {
      type: 'customer.subscription.updated',
      data: {
        object: {
          customer: 'cus_test123',
          status: 'active',
          items: {
            data: [{ price: { id: process.env.STRIPE_PRICE_ID_PRO } }],
          },
        },
      },
    };

    const mockStripe = new Stripe();
    mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

    supabaseAdmin.from().select().eq().single.mockResolvedValue({
      data: { id: 'test-user-id' },
    });

    const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'test-signature',
      },
      body: 'test-body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(supabaseAdmin.from).toHaveBeenCalledWith('users');
    expect(supabaseAdmin.from).toHaveBeenCalledWith('credits');
  });

  it('should handle customer.subscription.deleted event', async () => {
    const { supabaseAdmin } = require('@/lib/supabase');
    const Stripe = require('stripe');

    const mockEvent = {
      type: 'customer.subscription.deleted',
      data: {
        object: {
          customer: 'cus_test123',
        },
      },
    };

    const mockStripe = new Stripe();
    mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

    supabaseAdmin.from().select().eq().single.mockResolvedValue({
      data: { id: 'test-user-id' },
    });

    const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'test-signature',
      },
      body: 'test-body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(supabaseAdmin.from).toHaveBeenCalledWith('users');
    expect(supabaseAdmin.from).toHaveBeenCalledWith('credits');
  });

  it('should handle webhook signature verification error', async () => {
    const Stripe = require('stripe');

    const mockStripe = new Stripe();
    mockStripe.webhooks.constructEvent.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'invalid-signature',
      },
      body: 'test-body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid signature');
  });

  it('should handle missing user_id in checkout session', async () => {
    const { supabaseAdmin } = require('@/lib/supabase');
    const Stripe = require('stripe');

    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: {
            tier: 'STARTER',
          },
        },
      },
    };

    const mockStripe = new Stripe();
    mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

    const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'test-signature',
      },
      body: 'test-body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  it('should handle missing tier in checkout session', async () => {
    const { supabaseAdmin } = require('@/lib/supabase');
    const Stripe = require('stripe');

    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: {
            user_id: 'test-user-id',
          },
        },
      },
    };

    const mockStripe = new Stripe();
    mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

    const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'test-signature',
      },
      body: 'test-body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  it('should handle subscription update with inactive status', async () => {
    const { supabaseAdmin } = require('@/lib/supabase');
    const Stripe = require('stripe');

    const mockEvent = {
      type: 'customer.subscription.updated',
      data: {
        object: {
          customer: 'cus_test123',
          status: 'inactive',
          items: {
            data: [{ price: { id: process.env.STRIPE_PRICE_ID_PRO } }],
          },
        },
      },
    };

    const mockStripe = new Stripe();
    mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

    const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'test-signature',
      },
      body: 'test-body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  it('should handle subscription update with unknown price ID', async () => {
    const { supabaseAdmin } = require('@/lib/supabase');
    const Stripe = require('stripe');

    const mockEvent = {
      type: 'customer.subscription.updated',
      data: {
        object: {
          customer: 'cus_test123',
          status: 'active',
          items: {
            data: [{ price: { id: 'price_unknown' } }],
          },
        },
      },
    };

    const mockStripe = new Stripe();
    mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

    supabaseAdmin.from().select().eq().single.mockResolvedValue({
      data: { id: 'test-user-id' },
    });

    const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'test-signature',
      },
      body: 'test-body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(supabaseAdmin.from).toHaveBeenCalledWith('users');
    expect(supabaseAdmin.from).toHaveBeenCalledWith('credits');
  });

  it('should handle subscription deletion with no user found', async () => {
    const { supabaseAdmin } = require('@/lib/supabase');
    const Stripe = require('stripe');

    const mockEvent = {
      type: 'customer.subscription.deleted',
      data: {
        object: {
          customer: 'cus_test123',
        },
      },
    };

    const mockStripe = new Stripe();
    mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

    supabaseAdmin.from().select().eq().single.mockResolvedValue({
      data: null,
    });

    const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'test-signature',
      },
      body: 'test-body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  it('should handle unknown event types', async () => {
    const Stripe = require('stripe');

    const mockEvent = {
      type: 'unknown.event.type',
      data: {
        object: {},
      },
    };

    const mockStripe = new Stripe();
    mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

    const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'test-signature',
      },
      body: 'test-body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
  });

  it('should handle database errors gracefully', async () => {
    const { supabaseAdmin } = require('@/lib/supabase');
    const Stripe = require('stripe');

    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: {
            user_id: 'test-user-id',
            tier: 'STARTER',
          },
        },
      },
    };

    const mockStripe = new Stripe();
    mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

    supabaseAdmin.from().update.mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/stripe/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': 'test-signature',
      },
      body: 'test-body',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Database error');
  });
});
