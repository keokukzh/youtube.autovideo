import React from 'react';
import { render, screen } from '@testing-library/react';
import { PricingCard } from '@/components/landing/pricing/PricingCard';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Check: ({ className }: any) => <span data-testid="check-icon" className={className}>✓</span>
}));

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className} data-testid="card">{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className} data-testid="card-content">{children}</div>,
  CardDescription: ({ children, className }: any) => <p className={className} data-testid="card-description">{children}</p>,
  CardHeader: ({ children, className }: any) => <div className={className} data-testid="card-header">{children}</div>,
  CardTitle: ({ children, className }: any) => <h3 className={className} data-testid="card-title">{children}</h3>
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className }: any) => <button className={className} data-testid="button">{children}</button>
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className }: any) => <span className={className} data-testid="badge">{children}</span>
}));

describe('PricingCard', () => {
  const defaultProps = {
    title: 'Test Plan',
    price: 29,
    period: 'month',
    description: 'Test description',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    ctaText: 'Get Started',
    ctaHref: '/signup'
  };

  it('renders with default props', () => {
    render(<PricingCard {...defaultProps} />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toHaveTextContent('Test Plan');
    expect(screen.getByText('$29')).toBeInTheDocument();
    expect(screen.getByText('/month')).toBeInTheDocument();
    expect(screen.getByTestId('card-description')).toHaveTextContent('Test description');
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Feature 3')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/signup');
    expect(screen.getByTestId('button')).toHaveTextContent('Get Started');
  });

  it('renders with default variant', () => {
    render(<PricingCard {...defaultProps} variant="default" />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('group', 'relative', 'transition-all', 'duration-300', 'hover:scale-105');
    expect(card).not.toHaveClass('border-2', 'border-indigo-500');
  });

  it('renders with popular variant', () => {
    render(<PricingCard {...defaultProps} variant="popular" />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('border-2', 'border-indigo-500', 'bg-gradient-to-br', 'from-indigo-50/50', 'to-purple-50/50', 'shadow-2xl');
    
    expect(screen.getByTestId('badge')).toBeInTheDocument();
    expect(screen.getByTestId('badge')).toHaveTextContent('Most Popular');
  });

  it('renders with popular prop set to true', () => {
    render(<PricingCard {...defaultProps} popular={true} />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('border-2', 'border-indigo-500');
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });

  it('renders with correct price formatting', () => {
    render(<PricingCard {...defaultProps} price={0} />);
    expect(screen.getByText('$0')).toBeInTheDocument();

    render(<PricingCard {...defaultProps} price={99} />);
    expect(screen.getByText('$99')).toBeInTheDocument();
  });

  it('renders with correct period', () => {
    render(<PricingCard {...defaultProps} period="year" />);
    expect(screen.getByText('/year')).toBeInTheDocument();

    render(<PricingCard {...defaultProps} period="week" />);
    expect(screen.getByText('/week')).toBeInTheDocument();
  });

  it('renders features with check icons', () => {
    render(<PricingCard {...defaultProps} />);

    const checkIcons = screen.getAllByTestId('check-icon');
    expect(checkIcons).toHaveLength(3);
    
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Feature 3')).toBeInTheDocument();
  });

  it('renders with different icon sizes for popular variant', () => {
    render(<PricingCard {...defaultProps} variant="popular" />);

    const checkIcons = screen.getAllByTestId('check-icon');
    checkIcons.forEach(icon => {
      expect(icon).toHaveClass('mr-3', 'h-5', 'w-5', 'text-green-500');
    });
  });

  it('renders with different icon sizes for default variant', () => {
    render(<PricingCard {...defaultProps} variant="default" />);

    const checkIcons = screen.getAllByTestId('check-icon');
    checkIcons.forEach(icon => {
      expect(icon).toHaveClass('mr-2', 'h-4', 'w-4', 'text-green-500');
    });
  });

  it('renders with gradient text for popular variant', () => {
    render(<PricingCard {...defaultProps} variant="popular" />);

    const priceElement = screen.getByText('$29');
    expect(priceElement).toHaveClass('bg-gradient-to-r', 'from-indigo-600', 'to-purple-600', 'bg-clip-text', 'text-5xl', 'font-bold', 'text-transparent');
  });

  it('renders with regular text for default variant', () => {
    render(<PricingCard {...defaultProps} variant="default" />);

    const priceElement = screen.getByText('$29');
    expect(priceElement).toHaveClass('text-4xl', 'font-bold');
  });

  it('renders with correct button styling for popular variant', () => {
    render(<PricingCard {...defaultProps} variant="popular" />);

    const button = screen.getByTestId('button');
    expect(button).toHaveClass('w-full', 'group/btn', 'relative', 'overflow-hidden', 'bg-gradient-to-r', 'from-indigo-600', 'to-purple-600', 'font-semibold', 'shadow-lg', 'transition-all', 'duration-300', 'hover:shadow-indigo-500/25');
  });

  it('renders with correct button styling for default variant', () => {
    render(<PricingCard {...defaultProps} variant="default" />);

    const button = screen.getByTestId('button');
    expect(button).toHaveClass('w-full', 'gradient-primary');
  });

  it('renders with proper accessibility attributes', () => {
    render(<PricingCard {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/signup');
    
    const button = screen.getByTestId('button');
    expect(button).toBeInTheDocument();
  });

  it('renders with empty features array', () => {
    render(<PricingCard {...defaultProps} features={[]} />);

    const checkIcons = screen.queryAllByTestId('check-icon');
    expect(checkIcons).toHaveLength(0);
  });

  it('renders with single feature', () => {
    render(<PricingCard {...defaultProps} features={['Single Feature']} />);

    expect(screen.getByText('Single Feature')).toBeInTheDocument();
    expect(screen.getAllByTestId('check-icon')).toHaveLength(1);
  });
});
