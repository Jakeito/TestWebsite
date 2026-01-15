import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the homepage correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check for welcome message
    await expect(page.getByRole('heading', { name: /Welcome to My Personal Website/i })).toBeVisible();
    
    // Check for navigation cards
    await expect(page.getByRole('heading', { name: /About Me/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Resume/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Car Build/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Contact/i })).toBeVisible();
  });

  test('should navigate to different pages', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to About page
    await page.click('nav a[href="/about"]');
    await expect(page).toHaveURL('/about');
    await expect(page.getByRole('heading', { name: /About Me/i })).toBeVisible();
    
    // Navigate to Resume page
    await page.click('nav a[href="/resume"]');
    await expect(page).toHaveURL('/resume');
    await expect(page.getByRole('heading', { name: /Resume/i })).toBeVisible();
    
    // Navigate to Car Build page
    await page.click('nav a[href="/carbuild"]');
    await expect(page).toHaveURL('/carbuild');
    await expect(page.getByRole('heading', { name: /Car Build Project/i })).toBeVisible();
    
    // Navigate to Contact page
    await page.click('nav a[href="/contact"]');
    await expect(page).toHaveURL('/contact');
    await expect(page.getByRole('heading', { name: /Contact Me/i })).toBeVisible();
  });
});
