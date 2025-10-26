import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SettingsDisplay } from '@/components/dashboard/SettingsDisplay';
import { mockRouter } from '@/__tests__/utils/test-helpers';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: jest.fn(),
});

describe('SettingsDisplay', () => {
  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    created_at: '2024-01-01T00:00:00Z',
  };

  const mockProfile = {
    subscription_tier: 'FREE',
    email: 'test@example.com',
  };

  const defaultProps = {
    user: mockUser,
    profile: mockProfile,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render account overview section', () => {
    render(<SettingsDisplay {...defaultProps} />);

    expect(screen.getByText('Account Overview')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument();
  });

  it('should render all settings tabs', () => {
    render(<SettingsDisplay {...defaultProps} />);

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Billing')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('should show profile tab by default', () => {
    render(<SettingsDisplay {...defaultProps} />);

    expect(screen.getByText('Profile Information')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
  });

  it('should switch to security tab when clicked', () => {
    render(<SettingsDisplay {...defaultProps} />);

    const securityTab = screen.getByText('Security');
    fireEvent.click(securityTab);

    expect(screen.getByText('Change Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Current Password')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
  });

  it('should switch to billing tab when clicked', () => {
    render(<SettingsDisplay {...defaultProps} />);

    const billingTab = screen.getByText('Billing');
    fireEvent.click(billingTab);

    expect(screen.getByText('Billing & Subscription')).toBeInTheDocument();
    expect(screen.getByText('Current Plan')).toBeInTheDocument();
    expect(screen.getByText('Manage Subscription')).toBeInTheDocument();
  });

  it('should switch to notifications tab when clicked', () => {
    render(<SettingsDisplay {...defaultProps} />);

    const notificationsTab = screen.getByText('Notifications');
    fireEvent.click(notificationsTab);

    expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
    expect(screen.getByText('Email Notifications')).toBeInTheDocument();
    expect(screen.getByText('Generation Complete')).toBeInTheDocument();
    expect(screen.getByText('Credit Alerts')).toBeInTheDocument();
  });

  it('should show danger zone in security tab', () => {
    render(<SettingsDisplay {...defaultProps} />);

    const securityTab = screen.getByText('Security');
    fireEvent.click(securityTab);

    expect(screen.getByText('Danger Zone')).toBeInTheDocument();
    expect(screen.getByText('Delete Account')).toBeInTheDocument();
    expect(screen.getByText('Permanently delete your account and all associated data')).toBeInTheDocument();
  });

  it('should handle profile update successfully', async () => {
    render(<SettingsDisplay {...defaultProps} />);

    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });

    const updateButton = screen.getByText('Update Profile');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
    });
  });

  it('should handle profile update error', async () => {
    // Mock a failed profile update
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<SettingsDisplay {...defaultProps} />);

    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const updateButton = screen.getByText('Update Profile');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('should handle password change successfully', async () => {
    render(<SettingsDisplay {...defaultProps} />);

    const securityTab = screen.getByText('Security');
    fireEvent.click(securityTab);

    const currentPasswordInput = screen.getByLabelText('Current Password');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');

    fireEvent.change(currentPasswordInput, { target: { value: 'currentpass' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });

    const changeButton = screen.getByText('Change Password');
    fireEvent.click(changeButton);

    await waitFor(() => {
      expect(screen.getByText('Password changed successfully')).toBeInTheDocument();
    });
  });

  it('should validate password confirmation', async () => {
    render(<SettingsDisplay {...defaultProps} />);

    const securityTab = screen.getByText('Security');
    fireEvent.click(securityTab);

    const currentPasswordInput = screen.getByLabelText('Current Password');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');

    fireEvent.change(currentPasswordInput, { target: { value: 'currentpass' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });

    const changeButton = screen.getByText('Change Password');
    fireEvent.click(changeButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });

  it('should validate password length', async () => {
    render(<SettingsDisplay {...defaultProps} />);

    const securityTab = screen.getByText('Security');
    fireEvent.click(securityTab);

    const currentPasswordInput = screen.getByLabelText('Current Password');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');

    fireEvent.change(currentPasswordInput, { target: { value: 'currentpass' } });
    fireEvent.change(newPasswordInput, { target: { value: 'short' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'short' } });

    const changeButton = screen.getByText('Change Password');
    fireEvent.click(changeButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
  });

  it('should handle account deletion with confirmation', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);

    render(<SettingsDisplay {...defaultProps} />);

    const securityTab = screen.getByText('Security');
    fireEvent.click(securityTab);

    const deleteButton = screen.getByText('Delete Account');
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  it('should not delete account when confirmation is cancelled', async () => {
    (window.confirm as jest.Mock).mockReturnValue(false);

    render(<SettingsDisplay {...defaultProps} />);

    const securityTab = screen.getByText('Security');
    fireEvent.click(securityTab);

    const deleteButton = screen.getByText('Delete Account');
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('should show loading state during profile update', async () => {
    render(<SettingsDisplay {...defaultProps} />);

    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });

    const updateButton = screen.getByText('Update Profile');
    fireEvent.click(updateButton);

    expect(screen.getByText('Updating...')).toBeInTheDocument();
    expect(updateButton).toBeDisabled();
  });

  it('should show loading state during password change', async () => {
    render(<SettingsDisplay {...defaultProps} />);

    const securityTab = screen.getByText('Security');
    fireEvent.click(securityTab);

    const currentPasswordInput = screen.getByLabelText('Current Password');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');

    fireEvent.change(currentPasswordInput, { target: { value: 'currentpass' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });

    const changeButton = screen.getByText('Change Password');
    fireEvent.click(changeButton);

    expect(screen.getByText('Changing...')).toBeInTheDocument();
    expect(changeButton).toBeDisabled();
  });

  it('should show loading state during account deletion', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);

    render(<SettingsDisplay {...defaultProps} />);

    const securityTab = screen.getByText('Security');
    fireEvent.click(securityTab);

    const deleteButton = screen.getByText('Delete Account');
    fireEvent.click(deleteButton);

    expect(screen.getByText('Deleting...')).toBeInTheDocument();
    expect(deleteButton).toBeDisabled();
  });

  it('should show success message with proper styling', async () => {
    render(<SettingsDisplay {...defaultProps} />);

    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });

    const updateButton = screen.getByText('Update Profile');
    fireEvent.click(updateButton);

    await waitFor(() => {
      const successAlert = screen.getByText('Profile updated successfully').closest('[role="alert"]');
      expect(successAlert).toHaveClass('border-green-200', 'bg-green-50');
    });
  });

  it('should show error message with proper styling', async () => {
    render(<SettingsDisplay {...defaultProps} />);

    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const updateButton = screen.getByText('Update Profile');
    fireEvent.click(updateButton);

    await waitFor(() => {
      const errorAlert = screen.getByText('Please enter a valid email address').closest('[role="alert"]');
      expect(errorAlert).toHaveClass('border-red-200', 'bg-red-50');
    });
  });

  it('should show correct subscription badge for different tiers', () => {
    const proProfile = { ...mockProfile, subscription_tier: 'PRO' };
    render(<SettingsDisplay {...defaultProps} profile={proProfile} />);

    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('should navigate to pricing page when manage subscription is clicked', () => {
    render(<SettingsDisplay {...defaultProps} />);

    const billingTab = screen.getByText('Billing');
    fireEvent.click(billingTab);

    const manageButton = screen.getByText('Manage Subscription');
    fireEvent.click(manageButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/pricing');
  });

  it('should show correct member since date', () => {
    render(<SettingsDisplay {...defaultProps} />);

    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<SettingsDisplay {...defaultProps} />);

    const emailInput = screen.getByLabelText('Email Address');
    expect(emailInput).toHaveAttribute('type', 'email');

    const securityTab = screen.getByText('Security');
    fireEvent.click(securityTab);

    const currentPasswordInput = screen.getByLabelText('Current Password');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');

    expect(currentPasswordInput).toHaveAttribute('type', 'password');
    expect(newPasswordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('should show danger zone with proper styling', () => {
    render(<SettingsDisplay {...defaultProps} />);

    const securityTab = screen.getByText('Security');
    fireEvent.click(securityTab);

    const dangerZone = screen.getByText('Danger Zone').closest('.border-red-200');
    expect(dangerZone).toHaveClass('border-red-200');
  });

  it('should show notification preferences with configure buttons', () => {
    render(<SettingsDisplay {...defaultProps} />);

    const notificationsTab = screen.getByText('Notifications');
    fireEvent.click(notificationsTab);

    const configureButtons = screen.getAllByText('Configure');
    expect(configureButtons).toHaveLength(3);
  });

  it('should reset password form after successful change', async () => {
    render(<SettingsDisplay {...defaultProps} />);

    const securityTab = screen.getByText('Security');
    fireEvent.click(securityTab);

    const currentPasswordInput = screen.getByLabelText('Current Password');
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');

    fireEvent.change(currentPasswordInput, { target: { value: 'currentpass' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });

    const changeButton = screen.getByText('Change Password');
    fireEvent.click(changeButton);

    await waitFor(() => {
      expect(screen.getByText('Password changed successfully')).toBeInTheDocument();
    });

    // Form should be reset
    expect(currentPasswordInput).toHaveValue('');
    expect(newPasswordInput).toHaveValue('');
    expect(confirmPasswordInput).toHaveValue('');
  });

  it('should show correct subscription tier in billing section', () => {
    const proProfile = { ...mockProfile, subscription_tier: 'PRO' };
    render(<SettingsDisplay {...defaultProps} profile={proProfile} />);

    const billingTab = screen.getByText('Billing');
    fireEvent.click(billingTab);

    expect(screen.getByText('PRO Plan')).toBeInTheDocument();
  });

  it('should show billing history button', () => {
    render(<SettingsDisplay {...defaultProps} />);

    const billingTab = screen.getByText('Billing');
    fireEvent.click(billingTab);

    expect(screen.getByText('View Billing History')).toBeInTheDocument();
  });
});
