import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('loading screen shows initially', async ({ page }) => {
    await page.goto('/');
    // Check for "LOADING..." text
    await expect(page.getByText('LOADING...')).toBeVisible();
  });

  test('redirects to backend after loading', async ({ page }) => {
    await page.goto('/');

    // Wait for loading screen to disappear - increase timeout significantly for slow CI environment
    await expect(page.getByText('LOADING...')).toBeHidden({ timeout: 20000 });

    // URL should be /backend
    await expect(page).toHaveURL(/.*\/backend/);

    // Wait for content
    await expect(page.getByRole('heading', { name: 'Backend Engineering' })).toBeVisible({ timeout: 10000 });
  });

  test('clicking wheel navigates to frontend', async ({ page }) => {
    // Start at /backend
    await page.goto('/backend');

    // Wait for loading screen to disappear
    await expect(page.getByText('LOADING...')).toBeHidden({ timeout: 20000 });

    // Verify backend is loaded
    await expect(page.getByRole('heading', { name: 'Backend Engineering' })).toBeVisible();

    // Click on the canvas where the wheel is expected to be (top center)
    const viewportSize = page.viewportSize();
    if (viewportSize) {
      const x = viewportSize.width / 2;
      const y = viewportSize.height * 0.3; // 30% from top
      await page.mouse.click(x, y);
    }

    // Wait for navigation to /frontend
    await expect(page).toHaveURL(/.*\/frontend/, { timeout: 15000 });

    // Verify frontend content
    await expect(page.getByRole('heading', { name: 'Frontend Development' })).toBeVisible();
  });
});
