import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all sections', async ({ page }) => {
    // Check navigation
    await expect(
      page.getByRole('link', { name: 'ContentMultiplier.io' })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();

    // Check hero section
    await expect(page.getByText(/create 10x more content/i)).toBeVisible();
    await expect(page.getByText(/transform youtube videos/i)).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Start Creating Now' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Watch Demo' })
    ).toBeVisible();

    // Check content formats section
    await expect(
      page.getByText(/10 content formats from one input/i)
    ).toBeVisible();
    await expect(page.getByText(/5 twitter posts/i)).toBeVisible();
    await expect(page.getByText(/3 linkedin posts/i)).toBeVisible();
    await expect(page.getByText(/2 instagram captions/i)).toBeVisible();

    // Check features section
    await expect(page.getByText(/why contentmultiplier.io/i)).toBeVisible();
    await expect(page.getByText(/lightning fast/i)).toBeVisible();
    await expect(page.getByText(/platform optimized/i)).toBeVisible();
    await expect(page.getByText(/team ready/i)).toBeVisible();

    // Check pricing section
    await expect(page.getByText(/simple, transparent pricing/i)).toBeVisible();
    await expect(page.getByText(/free/i)).toBeVisible();
    await expect(page.getByText(/starter/i)).toBeVisible();
    await expect(page.getByText(/pro/i)).toBeVisible();
    await expect(page.getByText(/team/i)).toBeVisible();

    // Check testimonials section
    await expect(page.getByText(/loved by content creators/i)).toBeVisible();
    await expect(page.getByText(/sarah johnson/i)).toBeVisible();
    await expect(page.getByText(/mike chen/i)).toBeVisible();
    await expect(page.getByText(/emily rodriguez/i)).toBeVisible();

    // Check FAQ section
    await expect(page.getByText(/frequently asked questions/i)).toBeVisible();
    await expect(
      page.getByText(/how does contentmultiplier.io work/i)
    ).toBeVisible();

    // Check CTA section
    await expect(
      page.getByText(/ready to transform your content strategy/i)
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Get Started Free' })
    ).toBeVisible();

    // Check footer
    await expect(page.getByText(/contentmultiplier.io/i)).toBeVisible();
    await expect(page.getByText(/product/i)).toBeVisible();
    await expect(page.getByText(/support/i)).toBeVisible();
    await expect(page.getByText(/legal/i)).toBeVisible();
  });

  test('should navigate to sign up from hero CTA', async ({ page }) => {
    // Click on "Start Creating Now" button
    await page.getByRole('link', { name: 'Start Creating Now' }).click();

    // Should navigate to sign up page
    await expect(page).toHaveURL(/.*signup/);
  });

  test('should navigate to sign up from navigation', async ({ page }) => {
    // Click on "Get Started" button in navigation
    await page.getByRole('link', { name: 'Get Started' }).click();

    // Should navigate to sign up page
    await expect(page).toHaveURL(/.*signup/);
  });

  test('should navigate to sign in from navigation', async ({ page }) => {
    // Click on "Sign In" button in navigation
    await page.getByRole('link', { name: 'Sign In' }).click();

    // Should navigate to sign in page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should navigate to sign up from pricing cards', async ({ page }) => {
    // Click on "Get Started Free" button in Free plan
    await page.getByRole('link', { name: 'Get Started Free' }).first().click();

    // Should navigate to sign up page
    await expect(page).toHaveURL(/.*signup/);
  });

  test('should navigate to sign up from CTA section', async ({ page }) => {
    // Scroll to CTA section
    await page
      .getByText(/ready to transform your content strategy/i)
      .scrollIntoViewIfNeeded();

    // Click on "Get Started Free" button in CTA section
    await page.getByRole('link', { name: 'Get Started Free' }).last().click();

    // Should navigate to sign up page
    await expect(page).toHaveURL(/.*signup/);
  });

  test('should expand FAQ items', async ({ page }) => {
    // Scroll to FAQ section
    await page
      .getByText(/frequently asked questions/i)
      .scrollIntoViewIfNeeded();

    // Click on first FAQ item
    await page.getByText(/how does contentmultiplier.io work/i).click();

    // Should expand and show answer
    await expect(page.getByText(/simply paste a youtube url/i)).toBeVisible();

    // Click on second FAQ item
    await page.getByText(/what content formats do you generate/i).click();

    // Should expand and show answer
    await expect(
      page.getByText(/we generate 10 different formats/i)
    ).toBeVisible();
  });

  test('should display pricing information correctly', async ({ page }) => {
    // Scroll to pricing section
    await page
      .getByText(/simple, transparent pricing/i)
      .scrollIntoViewIfNeeded();

    // Check Free plan
    await expect(page.getByText('$0')).toBeVisible();
    await expect(page.getByText('5 credits per month')).toBeVisible();
    await expect(page.getByText('All 10 content formats')).toBeVisible();

    // Check Starter plan
    await expect(page.getByText('$39')).toBeVisible();
    await expect(page.getByText('50 credits per month')).toBeVisible();
    await expect(page.getByText('Priority support')).toBeVisible();

    // Check Pro plan
    await expect(page.getByText('$99')).toBeVisible();
    await expect(page.getByText('200 credits per month')).toBeVisible();
    await expect(page.getByText('Advanced analytics')).toBeVisible();
    await expect(page.getByText('Most Popular')).toBeVisible();

    // Check Team plan
    await expect(page.getByText('$199')).toBeVisible();
    await expect(page.getByText('500 credits per month')).toBeVisible();
    await expect(page.getByText('Team collaboration')).toBeVisible();
  });

  test('should display testimonials with star ratings', async ({ page }) => {
    // Scroll to testimonials section
    await page.getByText(/loved by content creators/i).scrollIntoViewIfNeeded();

    // Check that star ratings are visible
    const starRatings = page.locator('[data-testid="star-rating"]');
    await expect(starRatings).toHaveCount(3);

    // Check testimonial content
    await expect(
      page.getByText(/this tool has completely transformed/i)
    ).toBeVisible();
    await expect(
      page.getByText(/the quality of the generated content/i)
    ).toBeVisible();
    await expect(page.getByText(/our agency has increased/i)).toBeVisible();
  });

  test('should display content format cards with icons', async ({ page }) => {
    // Scroll to content formats section
    await page
      .getByText(/10 content formats from one input/i)
      .scrollIntoViewIfNeeded();

    // Check that all 10 content format cards are visible
    await expect(page.getByText('5 Twitter Posts')).toBeVisible();
    await expect(page.getByText('3 LinkedIn Posts')).toBeVisible();
    await expect(page.getByText('2 Instagram Captions')).toBeVisible();
    await expect(page.getByText('1 Blog Article')).toBeVisible();
    await expect(page.getByText('1 Email Newsletter')).toBeVisible();
    await expect(page.getByText('5 Quote Graphics')).toBeVisible();
    await expect(page.getByText('1 Twitter Thread')).toBeVisible();
    await expect(page.getByText('1 Podcast Show Notes')).toBeVisible();
    await expect(page.getByText('1 Video Script Summary')).toBeVisible();
    await expect(page.getByText('5 TikTok/Reels Hooks')).toBeVisible();
  });

  test('should display feature cards with descriptions', async ({ page }) => {
    // Scroll to features section
    await page.getByText(/why contentmultiplier.io/i).scrollIntoViewIfNeeded();

    // Check feature cards
    await expect(page.getByText('Lightning Fast')).toBeVisible();
    await expect(
      page.getByText('Generate 10+ content formats in under 5 minutes')
    ).toBeVisible();

    await expect(page.getByText('Platform Optimized')).toBeVisible();
    await expect(
      page.getByText('Each format is optimized for its platform')
    ).toBeVisible();

    await expect(page.getByText('Team Ready')).toBeVisible();
    await expect(
      page.getByText('Perfect for content teams, agencies, and solo creators')
    ).toBeVisible();

    await expect(page.getByText('Secure & Private')).toBeVisible();
    await expect(
      page.getByText('Your content is processed securely')
    ).toBeVisible();

    await expect(page.getByText('24/7 Available')).toBeVisible();
    await expect(
      page.getByText('Generate content anytime, anywhere')
    ).toBeVisible();

    await expect(page.getByText('Cost Effective')).toBeVisible();
    await expect(
      page.getByText('Save thousands on content creation costs')
    ).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that navigation is still visible
    await expect(
      page.getByRole('link', { name: 'ContentMultiplier.io' })
    ).toBeVisible();

    // Check that hero section is still visible
    await expect(page.getByText(/create 10x more content/i)).toBeVisible();

    // Check that CTA buttons are still visible
    await expect(
      page.getByRole('link', { name: 'Start Creating Now' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Watch Demo' })
    ).toBeVisible();

    // Check that content formats section is still visible
    await expect(
      page.getByText(/10 content formats from one input/i)
    ).toBeVisible();

    // Check that pricing section is still visible
    await expect(page.getByText(/simple, transparent pricing/i)).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Check that navigation is still visible
    await expect(
      page.getByRole('link', { name: 'ContentMultiplier.io' })
    ).toBeVisible();

    // Check that hero section is still visible
    await expect(page.getByText(/create 10x more content/i)).toBeVisible();

    // Check that content formats section is still visible
    await expect(
      page.getByText(/10 content formats from one input/i)
    ).toBeVisible();

    // Check that pricing section is still visible
    await expect(page.getByText(/simple, transparent pricing/i)).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/ContentMultiplier.io/);

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      'content',
      /transform youtube videos/i
    );

    // Check meta keywords
    const metaKeywords = page.locator('meta[name="keywords"]');
    await expect(metaKeywords).toHaveAttribute('content', /content creation/i);
  });

  test('should have proper heading structure', async ({ page }) => {
    // Check that there's only one h1
    const h1Elements = page.locator('h1');
    await expect(h1Elements).toHaveCount(1);

    // Check that h1 contains the main heading
    await expect(h1Elements.first()).toContainText(/create 10x more content/i);

    // Check that there are multiple h2 elements for sections
    const h2Elements = page.locator('h2');
    await expect(h2Elements).toHaveCount(6); // Content formats, Features, Pricing, Testimonials, FAQ, CTA
  });
});
