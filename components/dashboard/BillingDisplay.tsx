'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { PricingTier } from '@/lib/types';
import {
  AlertCircle,
  ArrowRight,
  Building,
  Calendar,
  Check,
  Coins,
  CreditCard,
  Crown,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface BillingDisplayProps {
  user: any;
  profile: any;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'FREE',
    name: 'Free',
    price: 0,
    credits: 5,
    features: [
      '5 credits per month',
      'All 10 content formats',
      'Basic support',
      'Content history (7 days)',
    ],
  },
  {
    id: 'STARTER',
    name: 'Starter',
    price: 39,
    credits: 50,
    features: [
      '50 credits per month',
      'All 10 content formats',
      'Priority support',
      'Content history (30 days)',
      'Bulk export',
    ],
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: 99,
    credits: 200,
    features: [
      '200 credits per month',
      'All 10 content formats',
      'Priority support',
      'Advanced analytics',
      'Content history (90 days)',
      'Bulk export',
      'API access',
    ],
    popular: true,
  },
  {
    id: 'TEAM',
    name: 'Team',
    price: 199,
    credits: 500,
    features: [
      '500 credits per month',
      'All 10 content formats',
      'Team collaboration',
      'White-label options',
      'Dedicated support',
      'Advanced analytics',
      'Content history (unlimited)',
      'Bulk export',
      'API access',
      'Custom integrations',
    ],
  },
];

export function BillingDisplay({ user, profile }: BillingDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const currentTier =
    pricingTiers.find((tier) => tier.id === profile?.subscription_tier) ||
    pricingTiers[0];

  const handleUpgrade = async (tierId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier: tierId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (error: any) {
      setError(error.message || 'Failed to initiate upgrade');
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would redirect to Stripe customer portal
      // For now, we'll just simulate the process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(
        'This would redirect to Stripe customer portal in a real implementation.'
      );
    } catch (error: any) {
      setError(error.message || 'Failed to open customer portal');
    } finally {
      setIsLoading(false);
    }
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'FREE':
        return <Coins className="h-5 w-5 text-gray-500" />;
      case 'STARTER':
        return <Zap className="h-5 w-5 text-blue-500" />;
      case 'PRO':
        return <Crown className="h-5 w-5 text-purple-500" />;
      case 'TEAM':
        return <Building className="text-gold-500 h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTierBadge = (tierId: string) => {
    switch (tierId) {
      case 'FREE':
        return <Badge variant="secondary">Free</Badge>;
      case 'STARTER':
        return <Badge className="bg-blue-100 text-blue-800">Starter</Badge>;
      case 'PRO':
        return <Badge className="bg-purple-100 text-purple-800">Pro</Badge>;
      case 'TEAM':
        return <Badge className="bg-gold-100 text-gold-800">Team</Badge>;
      default:
        return <Badge variant="secondary">{tierId}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="mr-2 h-5 w-5" />
            Current Plan
          </CardTitle>
          <CardDescription>
            Your current subscription and usage details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {getTierIcon(currentTier.id)}
                <span className="font-medium">{currentTier.name} Plan</span>
                {getTierBadge(currentTier.id)}
              </div>
              <p className="text-sm text-gray-500">
                {currentTier.credits} credits per month
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Billing Cycle</span>
              </div>
              <p className="text-sm text-gray-500">
                {currentTier.price === 0 ? 'No billing' : 'Monthly'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Next Billing</span>
              </div>
              <p className="text-sm text-gray-500">
                {currentTier.price === 0 ? 'N/A' : 'Next month'}
              </p>
            </div>
          </div>

          {currentTier.id !== 'FREE' && (
            <div className="mt-6 flex space-x-4">
              <Button onClick={handleManageSubscription} disabled={isLoading}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Manage Subscription
              </Button>
              <Button variant="outline" disabled={isLoading}>
                View Billing History
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
          <CardDescription>
            Track your credit usage and generation activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {currentTier.credits}
              </div>
              <div className="text-sm text-gray-500">Credits Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-500">Credits Used</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-500">Generations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-sm text-gray-500">Content Pieces</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Available Plans */}
      <div>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Available Plans</h2>
          <p className="mt-2 text-gray-600">
            Choose the plan that best fits your content creation needs
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pricingTiers.map((tier) => {
            const isCurrentPlan = tier.id === currentTier.id;
            const isUpgrade =
              pricingTiers.indexOf(tier) > pricingTiers.indexOf(currentTier);
            const isDowngrade =
              pricingTiers.indexOf(tier) < pricingTiers.indexOf(currentTier);

            return (
              <Card
                key={tier.id}
                className={`relative ${
                  tier.popular ? 'border-2 border-indigo-500' : ''
                } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500">
                    Most Popular
                  </Badge>
                )}

                {isCurrentPlan && (
                  <Badge className="absolute -top-3 right-4 bg-green-500">
                    Current Plan
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    {getTierIcon(tier.id)}
                  </div>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${tier.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <CardDescription>
                    {tier.credits} credits per month
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4">
                    {isCurrentPlan ? (
                      <Button className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : isUpgrade ? (
                      <Button
                        className="gradient-primary w-full"
                        onClick={() => handleUpgrade(tier.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Processing...' : 'Upgrade'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : isDowngrade ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleUpgrade(tier.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Processing...' : 'Downgrade'}
                      </Button>
                    ) : (
                      <Button
                        className="gradient-primary w-full"
                        onClick={() => handleUpgrade(tier.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Processing...' : 'Get Started'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Billing FAQ</CardTitle>
          <CardDescription>
            Common questions about billing and subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">How does billing work?</h4>
            <p className="text-sm text-gray-600">
              You're billed monthly for your subscription. Credits reset each
              month on your billing date.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Can I change my plan anytime?</h4>
            <p className="text-sm text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes
              take effect immediately.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">What happens to unused credits?</h4>
            <p className="text-sm text-gray-600">
              Unused credits don't roll over to the next month. We recommend
              using all your credits each month.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Do you offer refunds?</h4>
            <p className="text-sm text-gray-600">
              We offer a 30-day money-back guarantee on all paid plans. Contact
              support for assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
