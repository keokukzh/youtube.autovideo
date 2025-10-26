import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
  it('should render with default variant', () => {
    render(<Badge data-testid="badge">Default Badge</Badge>);

    const badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      'border-transparent',
      'bg-primary',
      'text-primary-foreground'
    );
  });

  it('should render with secondary variant', () => {
    render(
      <Badge variant="secondary" data-testid="badge">
        Secondary Badge
      </Badge>
    );

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass(
      'border-transparent',
      'bg-secondary',
      'text-secondary-foreground'
    );
  });

  it('should render with destructive variant', () => {
    render(
      <Badge variant="destructive" data-testid="badge">
        Destructive Badge
      </Badge>
    );

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass(
      'border-transparent',
      'bg-destructive',
      'text-destructive-foreground'
    );
  });

  it('should render with outline variant', () => {
    render(
      <Badge variant="outline" data-testid="badge">
        Outline Badge
      </Badge>
    );

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('text-foreground');
  });

  it('should apply custom className', () => {
    render(
      <Badge className="custom-badge-class" data-testid="badge">
        Custom Badge
      </Badge>
    );

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('custom-badge-class');
  });

  it('should render with correct base classes', () => {
    render(<Badge data-testid="badge">Base Badge</Badge>);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'rounded-full',
      'border',
      'px-2.5',
      'py-0.5',
      'text-xs',
      'font-semibold',
      'transition-colors'
    );
  });

  it('should have focus styles', () => {
    render(<Badge data-testid="badge">Focusable Badge</Badge>);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass(
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-ring',
      'focus:ring-offset-2'
    );
  });

  it('should render with hover effects for default variant', () => {
    render(<Badge data-testid="badge">Hover Badge</Badge>);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('hover:bg-primary/80');
  });

  it('should render with hover effects for secondary variant', () => {
    render(
      <Badge variant="secondary" data-testid="badge">
        Secondary Hover Badge
      </Badge>
    );

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('hover:bg-secondary/80');
  });

  it('should render with hover effects for destructive variant', () => {
    render(
      <Badge variant="destructive" data-testid="badge">
        Destructive Hover Badge
      </Badge>
    );

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('hover:bg-destructive/80');
  });

  it('should pass through HTML attributes', () => {
    render(
      <Badge
        data-testid="badge"
        aria-label="Custom badge"
        title="Badge tooltip"
      >
        Badge with Attributes
      </Badge>
    );

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('aria-label', 'Custom badge');
    expect(badge).toHaveAttribute('title', 'Badge tooltip');
  });

  it('should render with children content', () => {
    render(
      <Badge data-testid="badge">
        <span data-testid="badge-content">Badge Content</span>
      </Badge>
    );

    const badge = screen.getByTestId('badge');
    const content = screen.getByTestId('badge-content');

    expect(badge).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Badge Content');
  });

  it('should render with complex children', () => {
    render(
      <Badge data-testid="badge">
        <span className="mr-1">🔔</span>
        <span>Notification</span>
        <span className="ml-1">3</span>
      </Badge>
    );

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('🔔');
    expect(badge).toHaveTextContent('Notification');
    expect(badge).toHaveTextContent('3');
  });

  it('should handle empty content', () => {
    render(<Badge data-testid="badge" />);

    const badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('');
  });

  it('should handle numeric content', () => {
    render(<Badge data-testid="badge">{42}</Badge>);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('42');
  });

  it('should handle boolean content', () => {
    render(<Badge data-testid="badge">{String(true)}</Badge>);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('true');
  });

  it('should handle null content', () => {
    render(<Badge data-testid="badge">{null}</Badge>);

    const badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('');
  });

  it('should handle undefined content', () => {
    render(<Badge data-testid="badge">{undefined}</Badge>);

    const badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('');
  });

  it('should be focusable by default', () => {
    render(<Badge data-testid="badge">Focusable Badge</Badge>);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('focus:outline-none');
  });

  it('should have proper semantic structure', () => {
    render(<Badge data-testid="badge">Semantic Badge</Badge>);

    const badge = screen.getByTestId('badge');
    expect(badge.tagName).toBe('DIV');
  });

  it('should handle multiple variants correctly', () => {
    const variants = [
      'default',
      'secondary',
      'destructive',
      'outline',
    ] as const;

    variants.forEach((variant) => {
      const { unmount } = render(
        <Badge variant={variant} data-testid={`badge-${variant}`}>
          {variant} Badge
        </Badge>
      );

      const badge = screen.getByTestId(`badge-${variant}`);
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent(`${variant} Badge`);

      unmount();
    });
  });

  it('should maintain consistent styling across variants', () => {
    const variants = [
      'default',
      'secondary',
      'destructive',
      'outline',
    ] as const;

    variants.forEach((variant) => {
      const { unmount } = render(
        <Badge variant={variant} data-testid={`badge-${variant}`}>
          Test Badge
        </Badge>
      );

      const badge = screen.getByTestId(`badge-${variant}`);

      // All variants should have these base classes
      expect(badge).toHaveClass(
        'inline-flex',
        'items-center',
        'rounded-full',
        'border'
      );
      expect(badge).toHaveClass('px-2.5', 'py-0.5', 'text-xs', 'font-semibold');

      unmount();
    });
  });
});
