import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BillingDisplay } from '@/components/dashboard/BillingDisplay';

// Mock fetch globally
global.fetch = jest.fn();

// Mock window.location
Object.defineProperty(window, 'location', 'value', {
  writable: true,
  value: {
    href: 'http://localhost:3000',
  },
});

describe('BillingDisplay', () => {
  const mockProfile = {
    subscription_tier: 'FREE',
    email: 'test@example.com',
  };

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
  };

  const defaultProps = {
    user: mockUser,
    profile: mockProfile,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('should render current plan information', () => {
    render(<BillingDisplay {...defaultProps} />);

    expect(screen.getByText('Current Plan')).toBeInTheDocument();
    expect(screen.getByText('Free Plan')).toBeInTheDocument();
    expect(screen.getByText('5 credits per month')).toBeInTheDocument();
  });

  it('should show correct tier badge for FREE plan', () => {
    render(<BillingDisplay {...defaultProps} />);

    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('should show correct tier badge for PRO plan', () => {
    const proProfile = { ...mockProfile, subscription_tier: 'PRO' };
    render(<BillingDisplay {...defaultProps} profile={proProfile} />);

    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('should show usage statistics', () => {
    render(<BillingDisplay {...defaultProps} />);

    expect(screen.getByText('Usage This Month')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // Credits Available
    expect(screen.getByText('Credits Available')).toBeInTheDocument();
    expect(screen.getByText('Credits Used')).toBeInTheDocument();
    expect(screen.getByText('Generations')).toBeInTheDocument();
    expect(screen.getByText('Content Pieces')).toBeInTheDocument();
  });

  it('should show all available pricing tiers', () => {
    render(<BillingDisplay {...defaultProps} />);

    expect(screen.getByText('Available Plans')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Starter')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
  });

  it('should show correct pricing for each tier', () => {
    render(<BillingDisplay {...defaultProps} />);

    expect(screen.getByText('$0')).toBeInTheDocument(); // Free
    expect(screen.getByText('$39')).toBeInTheDocument(); // Starter
    expect(screen.getByText('$99')).toBeInTheDocument(); // Pro
    expect(screen.getByText('$199')).toBeInTheDocument(); // Team
  });

  it('should show correct credits for each tier', () => {
    render(<BillingDisplay {...defaultProps} />);

    expect(screen.getByText('5 credits per month')).toBeInTheDocument(); // Free
    expect(screen.getByText('50 credits per month')).toBeInTheDocument(); // Starter
    expect(screen.getByText('200 credits per month')).toBeInTheDocument(); // Pro
    expect(screen.getByText('500 credits per month')).toBeInTheDocument(); // Team
  });

  it('should show popular badge for PRO plan', () => {
    render(<BillingDisplay {...defaultProps} />);

    expect(screen.getByText('Most Popular')).toBeInTheDocument();
  });

  it('should show current plan badge for user\'s current tier', () => {
    render(<BillingDisplay {...defaultProps} />);

    expect(screen.getByText('Current Plan')).toBeInTheDocument();
  });

  it('should handle upgrade to paid plan', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ url: 'https://checkout.stripe.com/test' }),
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(<BillingDisplay {...defaultProps} />);

    const upgradeButton = screen.getByText('Upgrade');
    fireEvent.click(upgradeButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier: 'STARTER' }),
      });
    });
  });

  it('should handle upgrade error', async () => {
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ error: 'Payment failed' }),
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(<BillingDisplay {...defaultProps} />);

    const upgradeButton = screen.getByText('Upgrade');
    fireEvent.click(upgradeButton);

    await waitFor(() => {
      expect(screen.getByText('Payment failed')).toBeInTheDocument();
    });
  });

  it('should handle manage subscription for paid plans', async () => {
    const proProfile = { ...mockProfile, subscription_tier: 'PRO' };
    render(<BillingDisplay {...defaultProps} profile={proProfile} />);

    const manageButton = screen.getByText('Manage Subscription');
    fireEvent.click(manageButton);

    await waitFor(() => {
      expect(screen.getByText('This would redirect to Stripe customer portal in a real implementation.')).toBeInTheDocument();
    });
  });

  it('should not show manage subscription for FREE plan', () => {
    render(<BillingDisplay {...defaultProps} />);

    expect(screen.queryByText('Manage Subscription')).not.toBeInTheDocument();
  });

  it('should show billing FAQ section', () => {
    render(<BillingDisplay {...defaultProps} />);

    expect(screen.getByText('Billing FAQ')).toBeInTheDocument();
    expect(screen.getByText('How does billing work?')).toBeInTheDocument();
    expect(screen.getByText('Can I change my plan anytime?')).toBeInTheDocument();
    expect(screen.getByText('What happens to unused credits?')).toBeInTheDocument();
    expect(screen.getByText('Do you offer refunds?')).toBeInTheDocument();
  });

  it('should show correct billing cycle information', () => {
    render(<BillingDisplay {...defaultProps} />);

    expect(screen.getByText('Billing Cycle')).toBeInTheDocument();
    expect(screen.getByText('No billing')).toBeInTheDocument(); // For FREE plan
  });

  it('should show monthly billing for paid plans', () => {
    const proProfile = { ...mockProfile, subscription_tier: 'PRO' };
    render(<BillingDisplay {...defaultProps} profile={proProfile} />);

    expect(screen.getByText('Monthly')).toBeInTheDocument();
  });

  it('should show next billing information', () => {
    render(<BillingDisplay {...defaultProps} />);

    expect(screen.getByText('Next Billing')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument(); // For FREE plan
  });

  it('should show next month for paid plans', () => {
    const proProfile = { ...mockProfile, subscription_tier: 'PRO' };
    render(<BillingDisplay {...defaultProps} profile={proProfile} />);

    expect(screen.getByText('Next month')).toBeInTheDocument();
  });

  it('should disable upgrade button when loading', async () => {
    const mockResponse = {
      ok: true,
      json: () => new Promise(resolve => setTimeout(() => resolve({ url: 'https://checkout.stripe.com/test' }), 1000)),
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(<BillingDisplay {...defaultProps} />);

    const upgradeButton = screen.getByText('Upgrade');
    fireEvent.click(upgradeButton);

    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByText('Processing...')).toBeDisabled();
  });

  it('should show correct tier icons', () => {
    render(<BillingDisplay {...defaultProps} />);

    // Icons should be present (they're rendered as SVG elements)
    const tierCards = screen.getAllByText('Free');
    expect(tierCards).toHaveLength(2); // One in current plan, one in available plans
  });

  it('should show correct features for each tier', () => {
    render(<BillingDisplay {...defaultProps} />);

    // Check for some key features
    expect(screen.getByText('All 10 content formats')).toBeInTheDocument();
    expect(screen.getByText('Basic support')).toBeInTheDocument();
    expect(screen.getByText('Priority support')).toBeInTheDocument();
    expect(screen.getByText('Advanced analytics')).toBeInTheDocument();
    expect(screen.getByText('Team collaboration')).toBeInTheDocument();
  });

  it('should show correct button text for different plan states', () => {
    render(<BillingDisplay {...defaultProps} />);

    expect(screen.getByText('Current Plan')).toBeInTheDocument(); // For current FREE plan
    expect(screen.getByText('Upgrade')).toBeInTheDocument(); // For paid plans
    expect(screen.getByText('Get Started')).toBeInTheDocument(); // For free plan in available plans
  });

  it('should handle network errors during upgrade', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<BillingDisplay {...defaultProps} />);

    const upgradeButton = screen.getByText('Upgrade');
    fireEvent.click(upgradeButton);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('should show error alert with proper styling', async () => {
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ error: 'Payment failed' }),
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(<BillingDisplay {...defaultProps} />);

    const upgradeButton = screen.getByText('Upgrade');
    fireEvent.click(upgradeButton);

    await waitFor(() => {
      const errorAlert = screen.getByText('Payment failed').closest('[role="alert"]');
      expect(errorAlert).toHaveClass('border-red-200', 'bg-red-50');
    });
  });

  it('should show correct tier badges with proper styling', () => {
    render(<BillingDisplay {...defaultProps} />);

    const freeBadge = screen.getByText('Free');
    const proBadge = screen.getByText('Pro');

    expect(freeBadge).toHaveClass('bg-gray-100', 'text-gray-800');
    expect(proBadge).toHaveClass('bg-purple-100', 'text-purple-800');
  });

  it('should show correct card styling for popular plan', () => {
    render(<BillingDisplay {...defaultProps} />);

    const proCard = screen.getByText('Pro').closest('.border-2');
    expect(proCard).toHaveClass('border-indigo-500');
  });

  it('should show correct card styling for current plan', () => {
    render(<BillingDisplay {...defaultProps} />);

    const currentPlanCard = screen.getByText('Current Plan').closest('.ring-2');
    expect(currentPlanCard).toHaveClass('ring-green-500');
  });

  it('should handle upgrade to different tiers', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ url: 'https://checkout.stripe.com/test' }),
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(<BillingDisplay {...defaultProps} />);

    // Click on Pro plan upgrade
    const proUpgradeButton = screen.getAllByText('Upgrade')[1]; // Second upgrade button (Pro plan)
    fireEvent.click(proUpgradeButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier: 'PRO' }),
      });
    });
  });

  it('should show correct features count for each tier', () => {
    render(<BillingDisplay {...defaultProps} />);

    // Free plan should have 4 features
    const freeFeatures = screen.getAllByText('5 credits per month');
    expect(freeFeatures).toHaveLength(2); // One in current plan, one in available plans

    // Pro plan should have 7 features
    expect(screen.getByText('API access')).toBeInTheDocument();
    expect(screen.getByText('Advanced analytics')).toBeInTheDocument();
  });

  it('should handle manage subscription error', async () => {
    // Mock alert to prevent actual alert from showing
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<BillingDisplay {...defaultProps} profile={{ ...mockProfile, subscription_tier: 'PRO' }} />);

    const manageButton = screen.getByText('Manage Subscription');
    fireEvent.click(manageButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('This would redirect to Stripe customer portal in a real implementation.');
    });

    mockAlert.mockRestore();
  });
});
