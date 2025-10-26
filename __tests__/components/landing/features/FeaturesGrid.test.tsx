import React from 'react';
import { render, screen } from '@testing-library/react';
import { FeaturesGrid } from '@/components/landing/features/FeaturesGrid';

// Mock the FeatureCard component
jest.mock('@/components/landing/features/FeatureCard', () => ({
  FeatureCard: ({ title, description, icon }: any) => (
    <div data-testid={`feature-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <span data-testid="icon">{icon}</span>
    </div>
  ),
}));

describe('FeaturesGrid', () => {
  it('renders with all main elements', () => {
    render(<FeaturesGrid />);

    // Check for main section
    const section = screen
      .getByText('Why Choose ContentMultiplier?')
      .closest('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass(
      'bg-white',
      'px-4',
      'py-20',
      'sm:px-6',
      'lg:px-8'
    );

    // Check for heading
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Why Choose ContentMultiplier?');
    expect(heading).toHaveClass(
      'mb-4',
      'text-3xl',
      'font-bold',
      'text-gray-900',
      'sm:text-4xl'
    );

    // Check for description
    const description = screen.getByText(
      /Transform your content creation process/
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass(
      'mx-auto',
      'max-w-2xl',
      'text-xl',
      'text-gray-600',
      'mb-16'
    );
  });

  it('renders all feature cards', () => {
    render(<FeaturesGrid />);

    // Check for all feature cards
    expect(screen.getByTestId('feature-ai-powered')).toBeInTheDocument();
    expect(screen.getByTestId('feature-10-formats')).toBeInTheDocument();
    expect(screen.getByTestId('feature-time-saving')).toBeInTheDocument();
    expect(screen.getByTestId('feature-easy-to-use')).toBeInTheDocument();
    expect(screen.getByTestId('feature-quality-content')).toBeInTheDocument();
    expect(screen.getByTestId('feature-scalable')).toBeInTheDocument();
  });

  it('renders with responsive grid layout', () => {
    render(<FeaturesGrid />);

    const gridContainer =
      screen.getByTestId('feature-ai-powered').parentElement;
    expect(gridContainer).toHaveClass(
      'grid',
      'grid-cols-1',
      'gap-8',
      'md:grid-cols-2',
      'lg:grid-cols-3'
    );
  });

  it('renders with proper accessibility attributes', () => {
    render(<FeaturesGrid />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();

    const featureCards = screen.getAllByRole('heading', { level: 3 });
    expect(featureCards).toHaveLength(6);
  });
});
