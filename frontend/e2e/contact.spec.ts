import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('should submit contact form successfully', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill out the form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="subject"]', 'Test Subject');
    await page.fill('textarea[name="message"]', 'This is a test message.');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Check for success message (might need to mock API in real tests)
    // This is a basic test structure
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/contact');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // HTML5 validation should prevent submission
    // The form should still be on the contact page
    await expect(page).toHaveURL('/contact');
  });
});
