import { test, expect } from '@playwright/test';

test('runs simulation with default parameters and renders results', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await expect(page).toHaveTitle("Retirement Calculator");
  await expect(page.getByRole('heading', { name: 'Retirement Calculator' })).toBeVisible();

  const defaultScenario = {
    currentAge: 30,
    retirementAge: 65,
    lifeExpectancy: 90,
    portfolioValue: 50000,
    monthlyContribution: 500,
    expectedAnnualReturn: 5,
    inflationRate: 3,
    blackSwanProbability: 5,
    annualWithdrawal: 20000,
  };

  // Check all input fields exist and have correct default values
  await expect(page.getByLabel('Current Age')).toHaveValue(String(defaultScenario.currentAge));
  await expect(page.getByLabel('Retirement Age')).toHaveValue(String(defaultScenario.retirementAge));
  await expect(page.getByLabel('Life Expectancy')).toHaveValue(String(defaultScenario.lifeExpectancy));
  await expect(page.getByLabel('Portfolio Value (£)')).toHaveValue(String(defaultScenario.portfolioValue));
  await expect(page.getByLabel('Monthly Contribution (£)')).toHaveValue(String(defaultScenario.monthlyContribution));
  await expect(page.getByLabel('Expected Annual Return (%)')).toHaveValue(String(defaultScenario.expectedAnnualReturn));
  await expect(page.getByLabel('Inflation Rate (%)')).toHaveValue(String(defaultScenario.inflationRate));
  await expect(page.getByLabel('Black Swan Probability (%)')).toHaveValue(String(defaultScenario.blackSwanProbability));
  await expect(page.getByLabel('Annual Withdrawal (£)')).toHaveValue(String(defaultScenario.annualWithdrawal));

  // Check results are rendered
  // Chart
  await expect(page.getByText('Projection Chart')).toBeVisible();
  await expect(page.getByRole('application')).toBeVisible();

  // Chart lines
  await expect(page.locator('path[name="Best Case"]').first()).toBeVisible();
  await expect(page.locator('path[name="Worst Case"]').first()).toBeVisible();
  await expect(page.locator('path[name="10th-90th Percentile Range"]').first()).toBeVisible();
  await expect(page.locator('path[name="Median (50th Percentile)"]').first()).toBeVisible();

  // Chart legend
  await expect(page.locator('.recharts-default-legend')).toBeVisible();
  await expect(page.locator('.recharts-legend-item-text:has-text("Best Case")')).toBeVisible();
  await expect(page.locator('.recharts-legend-item-text:has-text("Worst Case")')).toBeVisible();
  await expect(page.locator('.recharts-legend-item-text:has-text("10th-90th Percentile Range")')).toBeVisible();
  await expect(page.locator('.recharts-legend-item-text:has-text("Median (50th Percentile)")')).toBeVisible();

  // Chart axes
  await expect(page.locator('.recharts-label:has-text("Age")')).toBeVisible();
  await expect(page.locator('.recharts-xAxis-tick-labels text').locator('nth=0')).toHaveText('30');
  await expect(page.locator('.recharts-xAxis-tick-labels text').locator('nth=-1')).toHaveText('90');
  await expect(page.locator('.recharts-label:has-text("Portfolio Value")')).toBeVisible();
  await expect(page.locator('.recharts-yAxis-tick-labels text').locator('nth=0')).toHaveText('£0');
  await expect(page.locator('.recharts-yAxis-tick-labels text').locator('nth=-1')).toHaveText(/^£\d+M$/);

  // Chart tooltip
  await expect(page.getByText('Percentiles show how outcomes vary across simulations.')).toBeHidden();
  await page.locator('.recharts-wrapper').hover();
  await expect(page.getByText('Percentiles show how outcomes vary across simulations.')).toBeVisible();

  // Plan Insights
  await expect(page.getByText('Plan Insights')).toBeVisible();
  await expect(page.getByText('Life Expectancy Goal')).toBeVisible();
  await expect(page.getByText('Portfolio at Retirement')).toBeVisible();

  // Check disclaimer is rendered
  await expect(page.getByText('This calculator is for informational purposes only and does not constitute financial, investment, or tax advice.')).toBeVisible();
});
