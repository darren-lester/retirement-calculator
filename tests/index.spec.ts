import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await expect(page).toHaveTitle(/Retirement Calculator/);
});

test('runs a simulation with default values on page load', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await expect(page.getByText('No results yet')).toBeHidden();
  await expect(page.getByRole('application')).toBeVisible();
});
