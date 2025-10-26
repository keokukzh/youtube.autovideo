import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const TIER_CREDITS = {
  FREE: 5,
  STARTER: 50,
  PRO: 200,
  TEAM: 500,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    // CRITICAL: Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const tier = session.metadata?.tier as keyof typeof TIER_CREDITS;

        if (userId && tier) {
          // Update user subscription tier
          await supabaseAdmin
            .from('users')
            .update({ subscription_tier: tier })
            .eq('id', userId);

          // Update credits
          await supabaseAdmin
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
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (user && subscription.status === 'active') {
          // Determine tier from price ID
          const priceId = subscription.items.data[0]?.price.id;
          let tier: keyof typeof TIER_CREDITS = 'FREE';

          if (priceId === process.env.STRIPE_PRICE_ID_STARTER) tier = 'STARTER';
          if (priceId === process.env.STRIPE_PRICE_ID_PRO) tier = 'PRO';
          if (priceId === process.env.STRIPE_PRICE_ID_TEAM) tier = 'TEAM';

          await supabaseAdmin
            .from('users')
            .update({ subscription_tier: tier })
            .eq('id', user.id);

          await supabaseAdmin
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

        const { data: user } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (user) {
          // Downgrade to FREE tier
          await supabaseAdmin
            .from('users')
            .update({ subscription_tier: 'FREE' })
            .eq('id', user.id);

          await supabaseAdmin
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

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
