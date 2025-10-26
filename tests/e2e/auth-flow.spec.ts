import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('should display landing page with sign up and sign in buttons', async ({
    page,
  }) => {
    // Check that the landing page loads
    await expect(page).toHaveTitle(/ContentMultiplier.io/);

    // Check for navigation elements
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();
  });

  test('should navigate to sign up page', async ({ page }) => {
    // Click on Get Started button
    await page.getByRole('link', { name: 'Get Started' }).click();

    // Should navigate to sign up page
    await expect(page).toHaveURL(/.*signup/);
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();
  });

  test('should navigate to sign in page', async ({ page }) => {
    // Click on Sign In button
    await page.getByRole('link', { name: 'Sign In' }).click();

    // Should navigate to sign in page
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });

  test('should show validation errors for invalid sign up', async ({
    page,
  }) => {
    // Navigate to sign up page
    await page.goto('/signup');

    // Try to submit empty form
    await page.getByRole('button', { name: /sign up/i }).click();

    // Should show validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should show validation errors for invalid email', async ({ page }) => {
    // Navigate to sign up page
    await page.goto('/signup');

    // Fill in invalid email
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill('password123');

    // Submit form
    await page.getByRole('button', { name: /sign up/i }).click();

    // Should show validation error
    await expect(page.getByText(/invalid email format/i)).toBeVisible();
  });

  test('should show validation errors for short password', async ({ page }) => {
    // Navigate to sign up page
    await page.goto('/signup');

    // Fill in short password
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('short');

    // Submit form
    await page.getByRole('button', { name: /sign up/i }).click();

    // Should show validation error
    await expect(
      page.getByText(/password must be at least 8 characters/i)
    ).toBeVisible();
  });

  test('should show validation errors for invalid sign in', async ({
    page,
  }) => {
    // Navigate to sign in page
    await page.goto('/login');

    // Try to submit empty form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should show validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should handle successful sign up', async ({ page }) => {
    // Navigate to sign up page
    await page.goto('/signup');

    // Fill in valid credentials
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');

    // Mock successful sign up
    await page.route('**/auth/v1/signup', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 'test-user-id', email: 'test@example.com' },
          session: null,
        }),
      });
    });

    // Submit form
    await page.getByRole('button', { name: /sign up/i }).click();

    // Should show success message or redirect
    await expect(page.getByText(/check your email/i)).toBeVisible();
  });

  test('should handle successful sign in', async ({ page }) => {
    // Navigate to sign in page
    await page.goto('/login');

    // Fill in valid credentials
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');

    // Mock successful sign in
    await page.route('**/auth/v1/token', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 'test-user-id', email: 'test@example.com' },
          session: { access_token: 'test-token' },
        }),
      });
    });

    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should handle sign in with invalid credentials', async ({ page }) => {
    // Navigate to sign in page
    await page.goto('/login');

    // Fill in invalid credentials
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');

    // Mock failed sign in
    await page.route('**/auth/v1/token', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Invalid credentials',
        }),
      });
    });

    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should show error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });

  test('should redirect authenticated user from auth pages', async ({
    page,
  }) => {
    // Mock authenticated user
    await page.route('**/auth/v1/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 'test-user-id', email: 'test@example.com' },
        }),
      });
    });

    // Try to access sign up page
    await page.goto('/signup');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);

    // Try to access sign in page
    await page.goto('/login');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should redirect unauthenticated user from protected pages', async ({
    page,
  }) => {
    // Mock unauthenticated user
    await page.route('**/auth/v1/user', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Unauthorized',
        }),
      });
    });

    // Try to access dashboard
    await page.goto('/dashboard');

    // Should redirect to sign in page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should handle sign out', async ({ page }) => {
    // Mock authenticated user
    await page.route('**/auth/v1/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 'test-user-id', email: 'test@example.com' },
        }),
      });
    });

    // Navigate to dashboard
    await page.goto('/dashboard');

    // Mock successful sign out
    await page.route('**/auth/v1/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });

    // Click sign out button
    await page.getByRole('button', { name: /sign out/i }).click();

    // Should redirect to landing page
    await expect(page).toHaveURL('/');
  });
});
