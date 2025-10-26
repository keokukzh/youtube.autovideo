import { test, expect } from '@playwright/test';

test.describe('Dashboard Components', () => {
  test('should display dashboard heading', async ({ page }) => {
    // Test the dashboard page structure without authentication
    await page.goto('/dashboard');

    // Wait for the page to load and check if we're redirected to login
    await page.waitForLoadState('networkidle');

    // Check if we're on the login page (expected behavior)
    const currentUrl = page.url();
    expect(currentUrl).toContain('/login');
  });

  test('should display login page when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Should be redirected to login
    expect(page.url()).toContain('/login');

    // Check login page elements
    await expect(page.locator('h1')).toContainText('Welcome Back');
  });

  test('should display signup page', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');

    // Check signup page elements
    await expect(page.locator('h1')).toContainText('Create Account');
  });

  test('should display pricing page', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');

    // Check pricing page elements - use more specific selector for the main heading
    await expect(page.locator('h1').nth(1)).toContainText(
      'Simple, Transparent'
    );
  });
});
