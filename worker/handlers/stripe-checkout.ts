/**
 * Stripe checkout handler for Cloudflare Workers
 */

import Stripe from 'stripe';
import { createSupabaseAdminClient, getCurrentUser } from '../utils/supabase';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from '../utils/response';
import type { RequestContext, StripeCheckoutSession } from '../types';

const PRICE_IDS = {
  STARTER: 'STRIPE_PRICE_ID_STARTER',
  PRO: 'STRIPE_PRICE_ID_PRO',
  TEAM: 'STRIPE_PRICE_ID_TEAM',
} as const;

export async function handleStripeCheckout(
  context: RequestContext
): Promise<Response> {
  const { request, env } = context;

  try {
    const user = await getCurrentUser(request, env);
    if (!user) {
      return unauthorizedResponse();
    }

    const { tier } = (await request.json()) as StripeCheckoutSession;

    if (!['STARTER', 'PRO', 'TEAM'].includes(tier)) {
      return errorResponse('Invalid tier', 400);
    }

    // Initialize Stripe
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    const supabase = createSupabaseAdminClient(env);

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('users')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email || user.email || 'no-email@example.com',
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Get price ID from environment
    const priceId = env[PRICE_IDS[tier as keyof typeof PRICE_IDS]];

    if (!priceId) {
      return errorResponse(`Price ID not configured for tier: ${tier}`, 500);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { user_id: user.id, tier },
    });

    return successResponse({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return errorResponse(error.message, 500);
  }
}
