import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

/**
 * Call-to-action section with animated background
 */
export default function CTASection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl">
          Ready to Transform Your Content Strategy?
        </h2>
        <p className="mb-10 text-xl text-gray-600 sm:text-2xl">
          Join thousands of creators who are already using
          ContentMultiplier.io to scale their content production.
        </p>
        <div className="flex flex-col justify-center gap-6 sm:flex-row">
          <Link href="/signup">
            <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 px-10 py-6 text-lg font-semibold shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/25">
              <span className="relative z-10">Get Started Free</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="group px-10 py-6 text-lg font-semibold ring-2 ring-gray-300 transition-all duration-300 hover:scale-105 hover:ring-indigo-500 hover:shadow-lg">
            View Pricing
          </Button>
        </div>
        <p className="mt-6 text-sm text-gray-500">
          No credit card required • 5 free credits to start
        </p>
      </div>
    </section>
  );
}
