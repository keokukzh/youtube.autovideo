import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroCTA } from '@/components/landing/hero/HeroCTA';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  ArrowRight: ({ className }: any) => <span data-testid="arrow-icon" className={className}>ArrowRight</span>,
  Play: ({ className }: any) => <span data-testid="play-icon" className={className}>Play</span>
}));

describe('HeroCTA', () => {
  it('renders with default props', () => {
    render(<HeroCTA>Test Button</HeroCTA>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Test Button');
    expect(button).toHaveClass('group', 'relative', 'overflow-hidden', 'px-10', 'py-6', 'text-lg', 'font-semibold', 'shadow-2xl', 'transition-all', 'duration-300', 'hover:scale-105');
    expect(button).toHaveClass('bg-gradient-to-r', 'from-indigo-600', 'to-purple-600', 'hover:shadow-indigo-500/25');
  });

  it('renders with primary variant', () => {
    render(<HeroCTA variant="primary">Primary Button</HeroCTA>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gradient-to-r', 'from-indigo-600', 'to-purple-600', 'hover:shadow-indigo-500/25');
    expect(button).toHaveTextContent('Primary Button');
  });

  it('renders with secondary variant', () => {
    render(<HeroCTA variant="secondary">Secondary Button</HeroCTA>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('ring-2', 'ring-gray-300', 'hover:shadow-lg', 'hover:ring-indigo-500');
    expect(button).toHaveTextContent('Secondary Button');
  });

  it('renders with arrow icon by default', () => {
    render(<HeroCTA>Button with Arrow</HeroCTA>);

    expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('play-icon')).not.toBeInTheDocument();
  });

  it('renders with play icon when specified', () => {
    render(<HeroCTA icon="play">Button with Play</HeroCTA>);

    expect(screen.getByTestId('play-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('arrow-icon')).not.toBeInTheDocument();
  });

  it('renders as a link when href is provided', () => {
    render(<HeroCTA href="/test-page">Link Button</HeroCTA>);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test-page');
    expect(link).toHaveTextContent('Link Button');
  });

  it('renders as a button when no href is provided', () => {
    render(<HeroCTA>Regular Button</HeroCTA>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Regular Button');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<HeroCTA onClick={handleClick}>Clickable Button</HeroCTA>);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with correct icon classes for arrow', () => {
    render(<HeroCTA icon="arrow">Arrow Button</HeroCTA>);

    const icon = screen.getByTestId('arrow-icon');
    expect(icon).toHaveClass('ml-2', 'h-5', 'w-5', 'transition-transform', 'duration-300', 'group-hover:translate-x-1');
  });

  it('renders with correct icon classes for play', () => {
    render(<HeroCTA icon="play">Play Button</HeroCTA>);

    const icon = screen.getByTestId('play-icon');
    expect(icon).toHaveClass('ml-2', 'h-5', 'w-5', 'transition-transform', 'duration-300', 'group-hover:scale-110');
  });

  it('renders with gradient overlay for primary variant', () => {
    render(<HeroCTA variant="primary">Primary with Overlay</HeroCTA>);

    const button = screen.getByRole('button');
    const overlay = button.querySelector('div');
    expect(overlay).toHaveClass('absolute', 'inset-0', 'bg-gradient-to-r', 'from-purple-600', 'to-pink-600', 'opacity-0', 'transition-opacity', 'duration-300', 'group-hover:opacity-100');
  });

  it('does not render gradient overlay for secondary variant', () => {
    render(<HeroCTA variant="secondary">Secondary Button</HeroCTA>);

    const button = screen.getByRole('button');
    const overlay = button.querySelector('div');
    expect(overlay).toBeNull();
  });

  it('renders with proper accessibility attributes', () => {
    render(<HeroCTA>Accessible Button</HeroCTA>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Accessible Button');
  });

  it('renders with custom children', () => {
    render(
      <HeroCTA>
        <span>Custom</span> <strong>Content</strong>
      </HeroCTA>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Custom Content');
    expect(button.querySelector('span')).toHaveTextContent('Custom');
    expect(button.querySelector('strong')).toHaveTextContent('Content');
  });
});
