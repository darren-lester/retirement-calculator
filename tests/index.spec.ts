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
    monthlyContribution: 250,
    expectedAnnualReturn: 8,
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
  await expect(page.locator('path[name="Best Case"]')).toBeVisible();
  await expect(page.locator('path[name="Worst Case"]')).toBeVisible();
  await expect(page.locator('path[name="10th-90th Percentile Range"]')).toBeVisible();
  await expect(page.locator('path[name="Median (50th Percentile)"]')).toBeVisible();

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

test('updates results when parameters are changed', async ({ page }) => {
  await page.goto('http://localhost:5173');

  const initialMedianPath = page.locator('path[name="Median (50th Percentile)"]');
  await expect(initialMedianPath).toBeVisible();
  const initialMedianPathD = await initialMedianPath.getAttribute('d');

  const initialRetirementAge = 65;
  const initialMonthlyContribution = 250;
  const initialExpectedReturn = 8;
  const initialPortfolioValue = 50000;

  await expect(page.getByLabel('Retirement Age')).toHaveValue(String(initialRetirementAge));
  await expect(page.getByLabel('Monthly Contribution (£)')).toHaveValue(String(initialMonthlyContribution));
  await expect(page.getByLabel('Expected Annual Return (%)')).toHaveValue(String(initialExpectedReturn));
  await expect(page.getByLabel('Portfolio Value (£)')).toHaveValue(String(initialPortfolioValue));

  // Verify initial insight shows correct retirement age
  const initialInsightParagraph = page.getByText('Portfolio at Retirement').locator('..').locator('p');
  await expect(initialInsightParagraph).toHaveText(new RegExp(`At age ${initialRetirementAge}`));

  // Change parameters to new values
  const newRetirementAge = 60;
  const newMonthlyContribution = 1000;
  const newExpectedReturn = 7;
  const newPortfolioValue = 100000;

  await page.getByLabel('Retirement Age').fill(String(newRetirementAge));
  await page.getByLabel('Monthly Contribution (£)').fill(String(newMonthlyContribution));
  await page.getByLabel('Expected Annual Return (%)').fill(String(newExpectedReturn));
  await page.getByLabel('Portfolio Value (£)').fill(String(newPortfolioValue));

  // Check median path has changed
  await expect(page.locator('path[name="Median (50th Percentile)"]')).not.toHaveAttribute('d', initialMedianPathD!);

  // Check insight paragraph has updated
  const updatedInsightParagraph = page.getByText('Portfolio at Retirement').locator('..').locator('p');
  await expect(updatedInsightParagraph).toHaveText(new RegExp(`At age ${newRetirementAge}`));
});
