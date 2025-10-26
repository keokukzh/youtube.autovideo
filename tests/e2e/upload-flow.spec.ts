import { test, expect } from '@playwright/test';

test.describe('Upload Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.evaluate(() => {
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: 'test-user',
          email: 'test@example.com',
          subscription_tier: 'FREE',
        })
      );
      window.__MOCK_CREDITS__ = {
        credits_remaining: 5,
        credits_total: 5,
      };
    });
  });

  test('should switch between upload tabs', async ({ page }) => {
    await page.goto('/dashboard');

    // Test YouTube tab
    await page.click('button:has-text("YouTube")');
    await expect(page.locator('[data-testid="youtube-form"]')).toBeVisible();

    // Test Audio tab
    await page.click('button:has-text("Audio")');
    await expect(page.locator('[data-testid="audio-form"]')).toBeVisible();

    // Test Text tab
    await page.click('button:has-text("Text")');
    await expect(page.locator('[data-testid="text-form"]')).toBeVisible();
  });

  test('should validate YouTube URL input', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('button:has-text("YouTube")');

    // Test invalid URL
    await page.fill('[data-testid="youtube-url"]', 'invalid-url');
    await page.click('button:has-text("Generate")');

    await expect(page.locator('text=Invalid YouTube URL')).toBeVisible();

    // Test valid URL
    await page.fill(
      '[data-testid="youtube-url"]',
      'https://youtube.com/watch?v=test123'
    );
    await page.click('button:has-text("Generate")');

    // Should not show validation error
    await expect(page.locator('text=Invalid YouTube URL')).not.toBeVisible();
  });

  test('should validate audio file upload', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('button:has-text("Audio")');

    // Test file size validation
    const fileInput = page.locator('[data-testid="audio-file"]');

    // Create a mock file that's too large
    await fileInput.setInputFiles({
      name: 'large-audio.mp3',
      mimeType: 'audio/mpeg',
      buffer: Buffer.alloc(30 * 1024 * 1024), // 30MB
    });

    await page.click('button:has-text("Generate")');
    await expect(page.locator('text=File too large')).toBeVisible();

    // Test valid file
    await fileInput.setInputFiles({
      name: 'valid-audio.mp3',
      mimeType: 'audio/mpeg',
      buffer: Buffer.alloc(1024 * 1024), // 1MB
    });

    await page.click('button:has-text("Generate")');
    await expect(page.locator('text=File too large')).not.toBeVisible();
  });

  test('should validate text input', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('button:has-text("Text")');

    // Test minimum length validation
    await page.fill('[data-testid="text-input"]', 'Short');
    await page.click('button:has-text("Generate")');

    await expect(
      page.locator('text=Text must be at least 100 characters')
    ).toBeVisible();

    // Test valid text
    const longText =
      'This is a much longer text that should meet the minimum character requirement for content generation. It needs to be at least 100 characters long to be considered valid input for the AI content generation process.';
    await page.fill('[data-testid="text-input"]', longText);
    await page.click('button:has-text("Generate")');

    await expect(
      page.locator('text=Text must be at least 100 characters')
    ).not.toBeVisible();
  });

  test('should show loading state during generation', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('button:has-text("Text")');

    const longText =
      'This is a much longer text that should meet the minimum character requirement for content generation. It needs to be at least 100 characters long to be considered valid input for the AI content generation process.';
    await page.fill('[data-testid="text-input"]', longText);

    // Mock the generation process
    await page.route('**/api/generate', async (route) => {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: 'gen-123' },
        }),
      });
    });

    await page.click('button:has-text("Generate")');

    // Check loading state
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    await expect(page.locator('button:has-text("Generate")')).toBeDisabled();
  });

  test('should handle generation success', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('button:has-text("Text")');

    const longText =
      'This is a much longer text that should meet the minimum character requirement for content generation. It needs to be at least 100 characters long to be considered valid input for the AI content generation process.';
    await page.fill('[data-testid="text-input"]', longText);

    // Mock successful generation
    await page.route('**/api/generate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { id: 'gen-123' },
        }),
      });
    });

    await page.click('button:has-text("Generate")');

    // Should redirect to generation results
    await expect(page).toHaveURL(/\/dashboard\/generation\/gen-123/);
  });

  test('should handle generation error', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('button:has-text("Text")');

    const longText =
      'This is a much longer text that should meet the minimum character requirement for content generation. It needs to be at least 100 characters long to be considered valid input for the AI content generation process.';
    await page.fill('[data-testid="text-input"]', longText);

    // Mock generation error
    await page.route('**/api/generate', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Generation failed',
        }),
      });
    });

    await page.click('button:has-text("Generate")');

    // Should show error message
    await expect(page.locator('text=Generation failed')).toBeVisible();
  });

  test('should check credits before generation', async ({ page }) => {
    // Mock no credits
    await page.evaluate(() => {
      window.__MOCK_CREDITS__ = {
        credits_remaining: 0,
        credits_total: 5,
      };
    });

    await page.goto('/dashboard');
    await page.click('button:has-text("Text")');

    const longText =
      'This is a much longer text that should meet the minimum character requirement for content generation. It needs to be at least 100 characters long to be considered valid input for the AI content generation process.';
    await page.fill('[data-testid="text-input"]', longText);
    await page.click('button:has-text("Generate")');

    // Should show insufficient credits message
    await expect(page.locator('text=Insufficient credits')).toBeVisible();
  });
});
