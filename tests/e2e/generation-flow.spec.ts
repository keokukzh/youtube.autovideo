import { test, expect } from '@playwright/test';

test.describe('Content Generation Flow', () => {
  test.beforeEach(async ({ page }) => {
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

    // Mock user credits
    await page.route('**/rest/v1/credits*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            user_id: 'test-user-id',
            credits: 50,
            subscription_tier: 'starter',
          },
        ]),
      });
    });

    // Navigate to dashboard
    await page.goto('/dashboard');
  });

  test('should display upload interface', async ({ page }) => {
    // Check that the upload interface is visible
    await expect(page.getByText(/upload your content/i)).toBeVisible();

    // Check for input tabs
    await expect(page.getByRole('tab', { name: /youtube/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /audio/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /text/i })).toBeVisible();
  });

  test('should handle YouTube URL input', async ({ page }) => {
    // Click on YouTube tab
    await page.getByRole('tab', { name: /youtube/i }).click();

    // Fill in YouTube URL
    await page
      .getByLabel(/youtube url/i)
      .fill('https://youtube.com/watch?v=test');

    // Mock successful generation creation
    await page.route('**/api/generate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            generation_id: 'test-generation-id',
            status: 'pending',
            poll_url: '/api/generation/test-generation-id',
          },
          message: 'Generation queued successfully',
        }),
      });
    });

    // Submit form
    await page.getByRole('button', { name: /generate content/i }).click();

    // Should show success message
    await expect(
      page.getByText(/generation queued successfully/i)
    ).toBeVisible();
  });

  test('should handle audio file upload', async ({ page }) => {
    // Click on Audio tab
    await page.getByRole('tab', { name: /audio/i }).click();

    // Create a test audio file
    const audioFile = new File(['test audio content'], 'test.mp3', {
      type: 'audio/mpeg',
    });

    // Upload file
    await page.setInputFiles('input[type="file"]', {
      name: 'test.mp3',
      mimeType: 'audio/mpeg',
      buffer: Buffer.from('test audio content'),
    });

    // Mock successful generation creation
    await page.route('**/api/generate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            generation_id: 'test-generation-id',
            status: 'pending',
            poll_url: '/api/generation/test-generation-id',
          },
          message: 'Generation queued successfully',
        }),
      });
    });

    // Submit form
    await page.getByRole('button', { name: /generate content/i }).click();

    // Should show success message
    await expect(
      page.getByText(/generation queued successfully/i)
    ).toBeVisible();
  });

  test('should handle text input', async ({ page }) => {
    // Click on Text tab
    await page.getByRole('tab', { name: /text/i }).click();

    // Fill in text content
    await page
      .getByLabel(/text content/i)
      .fill(
        'This is a test text content for content generation. It should be long enough to meet the minimum requirements.'
      );

    // Mock successful generation creation
    await page.route('**/api/generate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            generation_id: 'test-generation-id',
            status: 'pending',
            poll_url: '/api/generation/test-generation-id',
          },
          message: 'Generation queued successfully',
        }),
      });
    });

    // Submit form
    await page.getByRole('button', { name: /generate content/i }).click();

    // Should show success message
    await expect(
      page.getByText(/generation queued successfully/i)
    ).toBeVisible();
  });

  test('should show validation errors for invalid YouTube URL', async ({
    page,
  }) => {
    // Click on YouTube tab
    await page.getByRole('tab', { name: /youtube/i }).click();

    // Fill in invalid YouTube URL
    await page.getByLabel(/youtube url/i).fill('invalid-url');

    // Submit form
    await page.getByRole('button', { name: /generate content/i }).click();

    // Should show validation error
    await expect(page.getByText(/invalid youtube url/i)).toBeVisible();
  });

  test('should show validation errors for text that is too short', async ({
    page,
  }) => {
    // Click on Text tab
    await page.getByRole('tab', { name: /text/i }).click();

    // Fill in short text
    await page.getByLabel(/text content/i).fill('Too short');

    // Submit form
    await page.getByRole('button', { name: /generate content/i }).click();

    // Should show validation error
    await expect(
      page.getByText(/text must be at least 100 characters/i)
    ).toBeVisible();
  });

  test('should show validation errors for unsupported audio file', async ({
    page,
  }) => {
    // Click on Audio tab
    await page.getByRole('tab', { name: /audio/i }).click();

    // Create an unsupported file
    const unsupportedFile = new File(['test content'], 'test.txt', {
      type: 'text/plain',
    });

    // Upload file
    await page.setInputFiles('input[type="file"]', {
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('test content'),
    });

    // Should show validation error
    await expect(page.getByText(/unsupported audio format/i)).toBeVisible();
  });

  test('should show validation errors for audio file that is too large', async ({
    page,
  }) => {
    // Click on Audio tab
    await page.getByRole('tab', { name: /audio/i }).click();

    // Create a large file (simulate by setting the size property)
    const largeFile = new File(['test content'], 'test.mp3', {
      type: 'audio/mpeg',
    });
    Object.defineProperty(largeFile, 'size', { value: 26 * 1024 * 1024 }); // 26MB

    // Upload file
    await page.setInputFiles('input[type="file"]', {
      name: 'test.mp3',
      mimeType: 'audio/mpeg',
      buffer: Buffer.from('test content'),
    });

    // Should show validation error
    await expect(
      page.getByText(/file size must be less than 25mb/i)
    ).toBeVisible();
  });

  test('should handle insufficient credits', async ({ page }) => {
    // Mock insufficient credits
    await page.route('**/api/generate', async (route) => {
      await route.fulfill({
        status: 402,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Insufficient credits',
        }),
      });
    });

    // Click on YouTube tab
    await page.getByRole('tab', { name: /youtube/i }).click();

    // Fill in YouTube URL
    await page
      .getByLabel(/youtube url/i)
      .fill('https://youtube.com/watch?v=test');

    // Submit form
    await page.getByRole('button', { name: /generate content/i }).click();

    // Should show error message
    await expect(page.getByText(/insufficient credits/i)).toBeVisible();
  });

  test('should handle rate limiting', async ({ page }) => {
    // Mock rate limit exceeded
    await page.route('**/api/generate', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Rate limit exceeded. Try again in 900 seconds.',
        }),
      });
    });

    // Click on YouTube tab
    await page.getByRole('tab', { name: /youtube/i }).click();

    // Fill in YouTube URL
    await page
      .getByLabel(/youtube url/i)
      .fill('https://youtube.com/watch?v=test');

    // Submit form
    await page.getByRole('button', { name: /generate content/i }).click();

    // Should show error message
    await expect(page.getByText(/rate limit exceeded/i)).toBeVisible();
  });

  test('should poll for generation status', async ({ page }) => {
    // Mock generation creation
    await page.route('**/api/generate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            generation_id: 'test-generation-id',
            status: 'pending',
            poll_url: '/api/generation/test-generation-id',
          },
          message: 'Generation queued successfully',
        }),
      });
    });

    // Mock generation status polling
    await page.route('**/api/generation/test-generation-id', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'test-generation-id',
            status: 'completed',
            outputs: {
              twitter_posts: ['Test tweet 1', 'Test tweet 2'],
              linkedin_posts: ['Test LinkedIn post'],
              instagram_captions: ['Test Instagram caption'],
              blog_article: 'Test blog article content',
              email_newsletter: 'Test email newsletter content',
              quote_graphics: ['Test quote 1', 'Test quote 2'],
              twitter_thread: ['Test thread tweet 1', 'Test thread tweet 2'],
              podcast_show_notes: 'Test podcast show notes',
              video_script_summary: 'Test video script summary',
              tiktok_hooks: ['Test TikTok hook 1', 'Test TikTok hook 2'],
            },
          },
        }),
      });
    });

    // Click on YouTube tab
    await page.getByRole('tab', { name: /youtube/i }).click();

    // Fill in YouTube URL
    await page
      .getByLabel(/youtube url/i)
      .fill('https://youtube.com/watch?v=test');

    // Submit form
    await page.getByRole('button', { name: /generate content/i }).click();

    // Should show success message
    await expect(
      page.getByText(/generation queued successfully/i)
    ).toBeVisible();

    // Wait for polling to complete
    await expect(page.getByText(/generation completed/i)).toBeVisible();

    // Should show generated content
    await expect(page.getByText(/twitter posts/i)).toBeVisible();
    await expect(page.getByText(/linkedin posts/i)).toBeVisible();
    await expect(page.getByText(/instagram captions/i)).toBeVisible();
  });

  test('should handle generation failure', async ({ page }) => {
    // Mock generation creation
    await page.route('**/api/generate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            generation_id: 'test-generation-id',
            status: 'pending',
            poll_url: '/api/generation/test-generation-id',
          },
          message: 'Generation queued successfully',
        }),
      });
    });

    // Mock generation failure
    await page.route('**/api/generation/test-generation-id', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'test-generation-id',
            status: 'failed',
            error_message: 'Failed to process video',
          },
        }),
      });
    });

    // Click on YouTube tab
    await page.getByRole('tab', { name: /youtube/i }).click();

    // Fill in YouTube URL
    await page
      .getByLabel(/youtube url/i)
      .fill('https://youtube.com/watch?v=test');

    // Submit form
    await page.getByRole('button', { name: /generate content/i }).click();

    // Should show success message
    await expect(
      page.getByText(/generation queued successfully/i)
    ).toBeVisible();

    // Wait for polling to complete
    await expect(page.getByText(/generation failed/i)).toBeVisible();

    // Should show error message
    await expect(page.getByText(/failed to process video/i)).toBeVisible();
  });
});
