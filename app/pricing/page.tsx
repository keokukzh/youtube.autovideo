import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Check,
  Clock,
  Coins,
  Crown,
  Shield,
  Zap,
} from 'lucide-react'
import Link from 'next/link'

const pricingTiers = [
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
    description: 'Perfect for trying out the platform',
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
    description: 'Great for individual creators',
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
    description: 'Perfect for content teams',
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
    description: 'For agencies and large teams',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-gradient text-2xl font-bold">
                  ContentMultiplier.io
                </h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="gradient-primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Choose the plan that fits your content creation needs. All plans
            include access to all 10 content formats.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.id}
                className={`relative ${
                  tier.popular ? 'border-2 border-indigo-500' : ''
                }`}
              >
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    {tier.id === 'FREE' && (
                      <Coins className="h-6 w-6 text-gray-500" />
                    )}
                    {tier.id === 'STARTER' && (
                      <Zap className="h-6 w-6 text-blue-500" />
                    )}
                    {tier.id === 'PRO' && (
                      <Crown className="h-6 w-6 text-purple-500" />
                    )}
                    {tier.id === 'TEAM' && (
                      <Building className="text-gold-500 h-6 w-6" />
                    )}
                  </div>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${tier.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
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
                    <Link href="/signup">
                      <Button
                        className={`w-full ${
                          tier.popular ? 'gradient-primary' : ''
                        }`}
                        variant={tier.popular ? 'default' : 'outline'}
                      >
                        {tier.price === 0
                          ? 'Get Started Free'
                          : `Start ${tier.name} Plan`}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose ContentMultiplier.io?
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Built for creators who want to scale their content without
              sacrificing quality or spending endless hours writing.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Generate 10+ content formats in under 5 minutes. No more
                  spending hours on content creation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your content is processed securely and never shared with third
                  parties. Full data privacy guaranteed.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>24/7 Available</CardTitle>
                <CardDescription>
                  Generate content anytime, anywhere. No waiting for business
                  hours or human writers.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  How does billing work?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  You're billed monthly for your subscription. Credits reset
                  each month on your billing date. You can upgrade or downgrade
                  your plan at any time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  What happens to unused credits?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Unused credits don't roll over to the next month. We recommend
                  using all your credits each month to get the most value from
                  your subscription.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time. You'll
                  continue to have access to your plan until the end of your
                  current billing period.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We offer a 30-day money-back guarantee on all paid plans. If
                  you're not satisfied with the service, we'll refund your
                  payment in full.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-xl text-gray-600">
            Join thousands of creators who are already using
            ContentMultiplier.io to scale their content production.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="gradient-primary px-8 py-6 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                Learn More
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required • 5 free credits to start
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h3 className="mb-4 text-2xl font-bold">ContentMultiplier.io</h3>
          <p className="mb-4 text-gray-400">
            AI-powered content repurposing for the modern creator.
          </p>
          <p className="text-sm text-gray-500">
            © 2024 ContentMultiplier.io. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
