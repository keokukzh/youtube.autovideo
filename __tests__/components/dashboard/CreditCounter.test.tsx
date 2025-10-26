import React from 'react';
import { render, screen } from '@testing-library/react';
import { CreditCounter } from '@/components/dashboard/CreditCounter';

describe('CreditCounter', () => {
  const mockCredits = {
    id: 'credits-1',
    user_id: 'user-1',
    credits_remaining: 5,
    credits_total: 10,
    resets_at: '2024-02-01T00:00:00Z',
  };

  it('should render loading state when credits are null', () => {
    render(<CreditCounter credits={null} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Credits')).toBeInTheDocument();
  });

  it('should render credits information when provided', () => {
    render(<CreditCounter credits={mockCredits} />);

    expect(screen.getByText('Credits')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // credits_remaining
    expect(screen.getByText('10')).toBeInTheDocument(); // credits_total
    expect(screen.getByText('Resets Feb 1, 2024')).toBeInTheDocument();
  });

  it('should show correct credits remaining and total', () => {
    render(<CreditCounter credits={mockCredits} />);

    const creditsRemaining = screen.getByTestId('credits-remaining');
    const creditsTotal = screen.getByTestId('credits-total');

    expect(creditsRemaining).toHaveTextContent('5');
    expect(creditsTotal).toHaveTextContent('10');
  });

  it('should show low credits warning when credits are low', () => {
    const lowCredits = { ...mockCredits, credits_remaining: 1 };
    render(<CreditCounter credits={lowCredits} />);

    expect(screen.getByText('Get more credits')).toBeInTheDocument();
    expect(screen.getByText('Get more credits')).toHaveAttribute('href', '/pricing');
  });

  it('should show out of credits warning when credits are zero', () => {
    const noCredits = { ...mockCredits, credits_remaining: 0 };
    render(<CreditCounter credits={noCredits} />);

    expect(screen.getByText('Upgrade to get more credits')).toBeInTheDocument();
    expect(screen.getByText('Upgrade to get more credits')).toHaveAttribute('href', '/pricing');
  });

  it('should show correct badge variant for different credit states', () => {
    // Normal credits
    render(<CreditCounter credits={mockCredits} />);
    let badge = screen.getByText('5').closest('[data-testid="credits-remaining"]')?.parentElement;
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800'); // default variant

    // Low credits
    const lowCredits = { ...mockCredits, credits_remaining: 1 };
    render(<CreditCounter credits={lowCredits} />);
    badge = screen.getByText('1').closest('[data-testid="credits-remaining"]')?.parentElement;
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800'); // secondary variant

    // No credits
    const noCredits = { ...mockCredits, credits_remaining: 0 };
    render(<CreditCounter credits={noCredits} />);
    badge = screen.getByText('0').closest('[data-testid="credits-remaining"]')?.parentElement;
    expect(badge).toHaveClass('bg-red-100', 'text-red-800'); // destructive variant
  });

  it('should show correct reset date formatting', () => {
    render(<CreditCounter credits={mockCredits} />);

    expect(screen.getByText('Resets Feb 1, 2024')).toBeInTheDocument();
  });

  it('should show coins icon', () => {
    render(<CreditCounter credits={mockCredits} />);

    const coinsIcon = screen.getByRole('img', { hidden: true });
    expect(coinsIcon).toHaveClass('text-yellow-500');
  });

  it('should show calendar icon for reset date', () => {
    render(<CreditCounter credits={mockCredits} />);

    const calendarIcon = screen.getByRole('img', { hidden: true });
    expect(calendarIcon).toHaveClass('text-gray-500');
  });

  it('should have proper accessibility attributes', () => {
    render(<CreditCounter credits={mockCredits} />);

    const card = screen.getByTestId('credit-counter');
    expect(card).toBeInTheDocument();
  });

  it('should show correct card styling', () => {
    render(<CreditCounter credits={mockCredits} />);

    const card = screen.getByTestId('credit-counter');
    expect(card).toHaveClass('w-full', 'sm:w-64');
  });

  it('should show correct card styling for loading state', () => {
    render(<CreditCounter credits={null} />);

    const card = screen.getByText('Loading...').closest('.w-64');
    expect(card).toHaveClass('w-64');
  });

  it('should handle mock credits in test environment with separate remaining', () => {
    // Mock window.__MOCK_CREDITS__ for test environment with numeric total
    (window as any).__MOCK_CREDITS__ = 8;

    render(<CreditCounter credits={mockCredits} creditsRemaining={3} />);

    // Should use mock credits total and provided remaining
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Resets Feb 1, 2024')).toBeInTheDocument();

    // Clean up
    delete (window as any).__MOCK_CREDITS__;
  });

  it('should handle mock credits in test environment without separate remaining', () => {
    // Mock window.__MOCK_CREDITS__ for test environment with numeric total
    (window as any).__MOCK_CREDITS__ = 5;

    render(<CreditCounter credits={mockCredits} />);

    // Should use mock credits as both total and remaining (fallback behavior)
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Resets Feb 1, 2024')).toBeInTheDocument();

    // Clean up
    delete (window as any).__MOCK_CREDITS__;
  });

  it('should show correct text for different credit states', () => {
    // Normal credits - no warning
    render(<CreditCounter credits={mockCredits} />);
    expect(screen.queryByText('Get more credits')).not.toBeInTheDocument();
    expect(screen.queryByText('Upgrade to get more credits')).not.toBeInTheDocument();

    // Low credits
    const lowCredits = { ...mockCredits, credits_remaining: 1 };
    render(<CreditCounter credits={lowCredits} />);
    expect(screen.getByText('Get more credits')).toBeInTheDocument();

    // No credits
    const noCredits = { ...mockCredits, credits_remaining: 0 };
    render(<CreditCounter credits={noCredits} />);
    expect(screen.getByText('Upgrade to get more credits')).toBeInTheDocument();
  });

  it('should show correct badge styling for different credit states', () => {
    // Normal credits
    render(<CreditCounter credits={mockCredits} />);
    let badge = screen.getByText('5').closest('[data-testid="credits-remaining"]')?.parentElement;
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');

    // Low credits
    const lowCredits = { ...mockCredits, credits_remaining: 1 };
    render(<CreditCounter credits={lowCredits} />);
    badge = screen.getByText('1').closest('[data-testid="credits-remaining"]')?.parentElement;
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');

    // No credits
    const noCredits = { ...mockCredits, credits_remaining: 0 };
    render(<CreditCounter credits={noCredits} />);
    badge = screen.getByText('0').closest('[data-testid="credits-remaining"]')?.parentElement;
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('should show correct link styling for upgrade prompts', () => {
    const lowCredits = { ...mockCredits, credits_remaining: 1 };
    render(<CreditCounter credits={lowCredits} />);

    const link = screen.getByText('Get more credits');
    expect(link).toHaveClass('text-xs', 'text-primary', 'hover:underline');
  });

  it('should show correct link styling for upgrade prompts when out of credits', () => {
    const noCredits = { ...mockCredits, credits_remaining: 0 };
    render(<CreditCounter credits={noCredits} />);

    const link = screen.getByText('Upgrade to get more credits');
    expect(link).toHaveClass('text-xs', 'text-primary', 'hover:underline');
  });

  it('should show correct spacing and layout', () => {
    render(<CreditCounter credits={mockCredits} />);

    const card = screen.getByTestId('credit-counter');
    expect(card).toHaveClass('w-full', 'sm:w-64');

    const content = card.querySelector('.p-4');
    expect(content).toHaveClass('p-4');
  });

  it('should show correct text styling for reset date', () => {
    render(<CreditCounter credits={mockCredits} />);

    const resetDate = screen.getByText('Resets Feb 1, 2024');
    expect(resetDate).toHaveClass('text-xs', 'text-gray-500');
  });

  it('should show correct text styling for credits label', () => {
    render(<CreditCounter credits={mockCredits} />);

    const creditsLabel = screen.getByText('Credits');
    expect(creditsLabel).toHaveClass('text-sm', 'font-medium');
  });

  it('should show correct text styling for loading state', () => {
    render(<CreditCounter credits={null} />);

    const loadingText = screen.getByText('Loading...');
    expect(loadingText).toHaveClass('text-sm', 'font-medium');
  });
});
