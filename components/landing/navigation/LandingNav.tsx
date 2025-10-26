import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Landing page navigation component with sticky positioning and backdrop blur
 */
export function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-gradient text-2xl font-bold">
              ContentMultiplier.io
            </h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="gradient-primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
