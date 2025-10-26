import React from 'react';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/components/landing/hero/HeroSection';

// Mock the child components
jest.mock('@/components/landing/hero/HeroBackground', () => ({
  HeroBackground: () => <div data-testid="hero-background">Hero Background</div>
}));

jest.mock('@/components/landing/hero/HeroCTA', () => ({
  HeroCTA: ({ children, href, variant, icon }: any) => (
    <button data-testid={`hero-cta-${variant}`} data-href={href} data-icon={icon}>
      {children}
    </button>
  )
}));

describe('HeroSection', () => {
  it('renders with all main elements', () => {
    render(<HeroSection />);

    // Check for main section
    const section = screen.getByText('🚀 Now with AI-powered content generation').closest('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('relative', 'overflow-hidden', 'px-4', 'py-24', 'sm:px-6', 'lg:px-8');

    // Check for hero background
    expect(screen.getByTestId('hero-background')).toBeInTheDocument();

    // Check for badge
    const badge = screen.getByText('🚀 Now with AI-powered content generation');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('mb-6', 'animate-pulse', 'bg-gradient-to-r', 'from-indigo-100', 'to-purple-100', 'text-indigo-800', 'shadow-lg', 'ring-1', 'ring-indigo-200');

    // Check for main heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Create 10x More Content in 10% of the Time');
    expect(heading).toHaveClass('mb-8', 'text-4xl', 'font-bold', 'text-gray-900', 'sm:text-5xl', 'lg:text-7xl');

    // Check for description
    const description = screen.getByText(/Transform YouTube videos, podcasts, and blog posts into 10\+ ready-to-publish content formats with AI/);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('mx-auto', 'mb-10', 'max-w-3xl', 'text-xl', 'text-gray-600', 'sm:text-2xl');

    // Check for CTA buttons
    const primaryCTA = screen.getByTestId('hero-cta-primary');
    expect(primaryCTA).toBeInTheDocument();
    expect(primaryCTA).toHaveTextContent('Start Creating Now');
    expect(primaryCTA).toHaveAttribute('data-href', '/signup');

    const secondaryCTA = screen.getByTestId('hero-cta-secondary');
    expect(secondaryCTA).toBeInTheDocument();
    expect(secondaryCTA).toHaveTextContent('Watch Demo');
    expect(secondaryCTA).toHaveAttribute('data-icon', 'play');

    // Check for free plan text
    const freePlanText = screen.getByText('Free plan includes 5 credits • No credit card required');
    expect(freePlanText).toBeInTheDocument();
    expect(freePlanText).toHaveClass('mt-6', 'text-sm', 'text-gray-500');
  });

  it('renders with correct gradient text', () => {
    render(<HeroSection />);

    const gradientText = screen.getByText('10x More Content');
    expect(gradientText).toBeInTheDocument();
    expect(gradientText).toHaveClass('animate-gradient', 'bg-gradient-to-r', 'from-indigo-600', 'via-purple-600', 'to-pink-600', 'bg-clip-text', 'text-transparent');
  });

  it('renders with responsive layout', () => {
    render(<HeroSection />);

    // Check that the section has the correct classes
    const section = screen.getByText('🚀 Now with AI-powered content generation').closest('section');
    expect(section).toHaveClass('relative', 'overflow-hidden', 'px-4', 'py-24', 'sm:px-6', 'lg:px-8');

    // Check that the CTA container has the correct classes
    const ctaContainer = screen.getByTestId('hero-cta-primary').closest('div');
    expect(ctaContainer).toHaveClass('flex', 'flex-col', 'justify-center', 'gap-6', 'sm:flex-row');
  });

  it('renders with proper accessibility attributes', () => {
    render(<HeroSection />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });
});
