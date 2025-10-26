import { test, expect } from '@playwright/test';

// Extend Window interface for test mocks
declare global {
  interface Window {
    supabase?: any;
    __MOCK_CREDITS__?: any;
  }
}

test.describe('Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Supabase authentication and data
    await page.addInitScript(() => {
      // Mock Supabase client
      window.supabase = {
        auth: {
          getUser: () =>
            Promise.resolve({
              data: {
                user: {
                  id: 'test-user',
                  email: 'test@example.com',
                  created_at: '2024-01-01T00:00:00Z',
                },
              },
            }),
          signOut: () => Promise.resolve({ error: null }),
        },
      };

      // Mock credits data
      window.__MOCK_CREDITS__ = {
        credits_remaining: 5,
        credits_total: 5,
        resets_at: '2024-02-01T00:00:00Z',
      };

      // Mock user data in localStorage - ensure it's set before any page loads
      const userData = {
        id: 'test-user',
        email: 'test@example.com',
        subscription_tier: 'FREE',
      };
      
      // Set localStorage immediately when the script runs
      if (typeof Storage !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
      }
    });

    // Mock the server-side authentication
    await page.route('**/api/**', async (route) => {
      const url = route.request().url();
      if (url.includes('auth') || url.includes('user')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            user: {
              id: 'test-user',
              email: 'test@example.com',
              created_at: '2024-01-01T00:00:00Z',
            },
          }),
        });
      } else {
        await route.continue();
      }
    });
  });

  test('should display dashboard with user information', async ({ page }) => {
    await page.goto('/dashboard');

    // Check if dashboard elements are present
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(page.locator('[data-testid="credit-counter"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="upload-interface"]')
    ).toBeVisible();
  });

  test('should show credits information', async ({ page }) => {
    // Mock credits data before navigation
    await page.addInitScript(() => {
      window.__MOCK_CREDITS__ = {
        credits_remaining: 5,
        credits_total: 5,
      };
    });

    await page.goto('/dashboard');

    await expect(
      page.locator('[data-testid="credits-remaining"]')
    ).toContainText('5');
    await expect(page.locator('[data-testid="credits-total"]')).toContainText(
      '5'
    );
  });

  test('should display upload interface', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for the upload interface to load (lazy loaded)
    await page.waitForSelector('[data-testid="upload-interface"]', {
      timeout: 10000,
    });
    await expect(
      page.locator('[data-testid="upload-interface"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="upload-tabs"]')).toBeVisible();
    await expect(page.locator('button:has-text("YouTube")')).toBeVisible();
    await expect(page.locator('button:has-text("Audio")')).toBeVisible();
    await expect(page.locator('button:has-text("Text")')).toBeVisible();
  });

  test('should show upgrade prompt for free users with low credits', async ({
    page,
  }) => {
    // Mock low credits before navigation
    await page.addInitScript(() => {
      window.__MOCK_CREDITS__ = {
        credits_remaining: 1,
        credits_total: 5,
        resets_at: '2024-02-01T00:00:00Z',
      };
    });

    await page.goto('/dashboard');

    await expect(page.locator('text=Get more credits')).toBeVisible();
  });

  test('should navigate to billing page when upgrade is clicked', async ({
    page,
  }) => {
    await page.goto('/dashboard');

    // Click upgrade button if present
    const upgradeButton = page.locator('text=Upgrade').first();
    if (await upgradeButton.isVisible()) {
      await upgradeButton.click();
      await expect(page).toHaveURL('/dashboard/billing');
    }
  });

  test('should display generation history', async ({ page }) => {
    await page.goto('/dashboard/history');

    await expect(page.locator('h1')).toContainText('Generation History');
    await expect(page.locator('[data-testid="history-list"]')).toBeVisible();
  });

  test('should display settings page', async ({ page }) => {
    await page.goto('/dashboard/settings');

    await expect(page.locator('h1')).toContainText('Settings');
    await expect(page.locator('[data-testid="settings-form"]')).toBeVisible();
  });
});
