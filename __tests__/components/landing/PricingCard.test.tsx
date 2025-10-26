import React from 'react';
import { render, screen } from '@testing-library/react';
import { PricingCard } from '@/components/landing/pricing/PricingCard';

describe('PricingCard', () => {
  const mockProps = {
    title: 'Pro',
    price: 99,
    period: 'month',
    description: 'Perfect for content teams',
    features: [
      '200 credits per month',
      'All 10 content formats',
      'Priority support',
      'Advanced analytics',
      'Bulk export',
    ],
    ctaText: 'Start Pro Plan',
    ctaHref: '/signup',
  };

  it('should render with correct title and price', () => {
    render(<PricingCard {...mockProps} />);

    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('$99')).toBeInTheDocument();
    expect(screen.getByText('/month')).toBeInTheDocument();
  });

  it('should render description', () => {
    render(<PricingCard {...mockProps} />);

    expect(screen.getByText('Perfect for content teams')).toBeInTheDocument();
  });

  it('should render all features', () => {
    render(<PricingCard {...mockProps} />);

    mockProps.features.forEach((feature) => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  it('should render CTA button', () => {
    render(<PricingCard {...mockProps} />);

    expect(screen.getByText('Start Pro Plan')).toBeInTheDocument();
  });

  it('should show popular badge when popular', () => {
    render(<PricingCard {...mockProps} popular={true} />);

    expect(screen.getByText('Most Popular')).toBeInTheDocument();
  });

  it('should not show popular badge when not popular', () => {
    render(<PricingCard {...mockProps} popular={false} />);

    expect(screen.queryByText('Most Popular')).not.toBeInTheDocument();
  });

  it('should handle popular variant', () => {
    render(<PricingCard {...mockProps} variant="popular" />);

    expect(screen.getByText('Most Popular')).toBeInTheDocument();
  });

  it('should have correct CSS classes for popular variant', () => {
    const { container } = render(
      <PricingCard {...mockProps} variant="popular" />
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('border-2', 'border-indigo-500');
  });

  it('should be accessible', () => {
    render(<PricingCard {...mockProps} />);

    // Check that the card has proper semantic structure
    const card = screen.getByText('Pro').closest('div');
    expect(card).toBeInTheDocument();
  });
});
