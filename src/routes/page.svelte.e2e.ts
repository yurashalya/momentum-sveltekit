import { expect, test } from '@playwright/test';

test('renders the Momentum starter page', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle('Momentum — SvelteKit foundation');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
