import React from 'react';
import { render, screen } from '@testing-library/react';
import { PricingSection } from '@/components/landing/pricing/PricingSection';

// Mock the PricingCard component
jest.mock('@/components/landing/pricing/PricingCard', () => ({
  PricingCard: ({ title, price, period, description, features, ctaText, ctaHref, variant }: any) => (
    <div data-testid={`pricing-card-${title.toLowerCase()}`} data-variant={variant}>
      <h3>{title}</h3>
      <div>${price}/{period}</div>
      <p>{description}</p>
      <ul>
        {features.map((feature: string, index: number) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <a href={ctaHref}>{ctaText}</a>
    </div>
  )
}));

describe('PricingSection', () => {
  it('renders with all main elements', () => {
    render(<PricingSection />);

    // Check for main section
    const section = screen.getByText('Simple, Transparent Pricing').closest('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('bg-white', 'px-4', 'py-20', 'sm:px-6', 'lg:px-8');

    // Check for heading
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Simple, Transparent Pricing');
    expect(heading).toHaveClass('mb-4', 'text-3xl', 'font-bold', 'text-gray-900', 'sm:text-4xl');

    // Check for description
    const description = screen.getByText(/Choose the plan that fits your content creation needs/);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('mx-auto', 'max-w-2xl', 'text-xl', 'text-gray-600');
  });

  it('renders all four pricing tiers', () => {
    render(<PricingSection />);

    // Check for all pricing cards
    expect(screen.getByTestId('pricing-card-free')).toBeInTheDocument();
    expect(screen.getByTestId('pricing-card-starter')).toBeInTheDocument();
    expect(screen.getByTestId('pricing-card-pro')).toBeInTheDocument();
    expect(screen.getByTestId('pricing-card-team')).toBeInTheDocument();
  });

  it('renders Free tier with correct data', () => {
    render(<PricingSection />);

    const freeCard = screen.getByTestId('pricing-card-free');
    expect(freeCard).toHaveAttribute('data-variant', 'default');
    expect(freeCard).toHaveTextContent('Free');
    expect(freeCard).toHaveTextContent('$0/month');
    expect(freeCard).toHaveTextContent('Perfect for trying out the platform');
    expect(freeCard).toHaveTextContent('5 credits per month');
    expect(freeCard).toHaveTextContent('All 10 content formats');
    expect(freeCard).toHaveTextContent('Basic support');
    expect(freeCard).toHaveTextContent('Get Started Free');
  });

  it('renders Starter tier with correct data', () => {
    render(<PricingSection />);

    const starterCard = screen.getByTestId('pricing-card-starter');
    expect(starterCard).toHaveAttribute('data-variant', 'default');
    expect(starterCard).toHaveTextContent('Starter');
    expect(starterCard).toHaveTextContent('$39/month');
    expect(starterCard).toHaveTextContent('Great for individual creators');
    expect(starterCard).toHaveTextContent('50 credits per month');
    expect(starterCard).toHaveTextContent('Priority support');
    expect(starterCard).toHaveTextContent('Content history');
  });

  it('renders Pro tier with correct data and popular variant', () => {
    render(<PricingSection />);

    const proCard = screen.getByTestId('pricing-card-pro');
    expect(proCard).toHaveAttribute('data-variant', 'popular');
    expect(proCard).toHaveTextContent('Pro');
    expect(proCard).toHaveTextContent('$99/month');
    expect(proCard).toHaveTextContent('Perfect for content teams');
    expect(proCard).toHaveTextContent('200 credits per month');
    expect(proCard).toHaveTextContent('Advanced analytics');
    expect(proCard).toHaveTextContent('Bulk export');
  });

  it('renders Team tier with correct data', () => {
    render(<PricingSection />);

    const teamCard = screen.getByTestId('pricing-card-team');
    expect(teamCard).toHaveAttribute('data-variant', 'default');
    expect(teamCard).toHaveTextContent('Team');
    expect(teamCard).toHaveTextContent('$199/month');
    expect(teamCard).toHaveTextContent('For agencies and large teams');
    expect(teamCard).toHaveTextContent('500 credits per month');
    expect(teamCard).toHaveTextContent('Team collaboration');
    expect(teamCard).toHaveTextContent('White-label options');
    expect(teamCard).toHaveTextContent('Dedicated support');
  });

  it('renders with responsive grid layout', () => {
    render(<PricingSection />);

    const gridContainer = screen.getByTestId('pricing-card-free').parentElement;
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'gap-8', 'md:grid-cols-2', 'lg:grid-cols-4');
  });

  it('renders with proper accessibility attributes', () => {
    render(<PricingSection />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4); // One CTA link per pricing card
  });

  it('renders with correct container structure', () => {
    render(<PricingSection />);

    const container = screen.getByText('Simple, Transparent Pricing').closest('section')?.querySelector('div');
    expect(container).toHaveClass('mx-auto', 'max-w-7xl');

    const headerContainer = screen.getByText('Simple, Transparent Pricing').closest('div');
    expect(headerContainer).toHaveClass('mb-16', 'text-center');
  });
});
