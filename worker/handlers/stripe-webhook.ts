/**
 * Stripe webhook handler for Cloudflare Workers
 */

import Stripe from 'stripe';
import { createSupabaseAdminClient } from '../utils/supabase';
import { successResponse, errorResponse } from '../utils/response';
import type { RequestContext } from '../types';
import { TIER_CREDITS } from '../types';

export async function handleStripeWebhook(
  context: RequestContext
): Promise<Response> {
  const { request, env } = context;

  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return errorResponse('Missing Stripe signature', 400);
    }

    // Initialize Stripe
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    const supabase = createSupabaseAdminClient(env);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const tier = session.metadata?.tier as keyof typeof TIER_CREDITS;

        if (userId && tier) {
          // Update user subscription tier
          await supabase
            .from('users')
            .update({ subscription_tier: tier })
            .eq('id', userId);

          // Update credits
          await supabase
            .from('credits')
            .update({
              credits_total: TIER_CREDITS[tier],
              credits_remaining: TIER_CREDITS[tier],
              resets_at: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toISOString(),
            })
            .eq('user_id', userId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get user by Stripe customer ID
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (user && subscription.status === 'active') {
          // Determine tier from price ID
          const priceId = subscription.items.data[0]?.price.id;
          let tier: keyof typeof TIER_CREDITS = 'FREE';

          if (priceId === env.STRIPE_PRICE_ID_STARTER) tier = 'STARTER';
          if (priceId === env.STRIPE_PRICE_ID_PRO) tier = 'PRO';
          if (priceId === env.STRIPE_PRICE_ID_TEAM) tier = 'TEAM';

          await supabase
            .from('users')
            .update({ subscription_tier: tier })
            .eq('id', user.id);

          await supabase
            .from('credits')
            .update({
              credits_total: TIER_CREDITS[tier],
              credits_remaining: TIER_CREDITS[tier],
            })
            .eq('user_id', user.id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (user) {
          // Downgrade to FREE tier
          await supabase
            .from('users')
            .update({ subscription_tier: 'FREE' })
            .eq('id', user.id);

          await supabase
            .from('credits')
            .update({
              credits_total: TIER_CREDITS.FREE,
              credits_remaining: TIER_CREDITS.FREE,
            })
            .eq('user_id', user.id);
        }
        break;
      }
    }

    return successResponse({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook error:', error);
    return errorResponse(error.message, 400);
  }
}
