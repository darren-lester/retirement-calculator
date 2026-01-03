import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await expect(page).toHaveTitle(/Retirement Calculator/);
});

test('runs a simulation with default values', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await expect(page.getByText('No results yet')).toBeVisible();

  await page.getByRole('button', { name: 'Run Simulation' }).click();

  await expect(page.getByText('No results yet')).toBeHidden();
});

test('runs a simulation with custom values', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await expect(page.getByText('No results yet')).toBeVisible();

  await page.getByRole('spinbutton', { name: 'Portfolio Value' }).click();
  await page.getByRole('spinbutton', { name: 'Portfolio Value' }).fill('250000');
  await page.getByRole('spinbutton', { name: 'Current Age' }).click();
  await page.getByRole('spinbutton', { name: 'Current Age' }).fill('35');
  await page.getByRole('spinbutton', { name: 'Retirement Age' }).click();
  await page.getByRole('spinbutton', { name: 'Retirement Age' }).fill('60');
  await page.getByRole('spinbutton', { name: 'Life Expectancy' }).click();
  await page.getByRole('spinbutton', { name: 'Life Expectancy' }).fill('85');
  await page.getByRole('spinbutton', { name: 'Monthly Contribution' }).click();
  await page.getByRole('spinbutton', { name: 'Monthly Contribution' }).fill('1000');
  await page.getByRole('spinbutton', { name: 'Annual Withdrawal' }).click();
  await page.getByRole('spinbutton', { name: 'Annual Withdrawal' }).fill('40000');
  await page.getByRole('spinbutton', { name: 'Inflation Rate (%)' }).click();
  await page.getByRole('spinbutton', { name: 'Inflation Rate (%)' }).fill('2');
  await page.getByRole('spinbutton', { name: 'Black Swan Probability (%)' }).fill('10');
  await page.getByRole('button', { name: 'Run Simulation' }).click();

  await expect(page.getByText('No results yet')).not.toBeVisible();
});
