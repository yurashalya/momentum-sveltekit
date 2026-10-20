import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('shows the marketing sections and keeps the selected theme', async ({ page }) => {
	await page.goto('/');

	await expect(page).toHaveTitle('Momentum — A clearer way to keep campaigns moving');
	await expect(
		page.getByRole('heading', { level: 1, name: /make room for momentum/i })
	).toBeVisible();
	await expect(
		page.getByRole('heading', { level: 2, name: /everything in its right place/i })
	).toBeVisible();
	await expect(
		page.getByRole('heading', { level: 2, name: /room to grow at your pace/i })
	).toBeVisible();
	await expect(
		page.getByRole('heading', { level: 2, name: /a little more clarity changes a lot/i })
	).toBeVisible();

	const accessibility = await new AxeBuilder({ page }).analyze();
	expect(
		accessibility.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
	).toEqual([]);

	await page
		.getByRole('navigation', { name: 'Primary navigation' })
		.getByRole('link', { name: 'Pricing' })
		.click();
	await expect(page).toHaveURL(/#pricing$/);

	await page.getByRole('button', { name: 'Switch to light theme' }).click();
	await expect(page.locator('html')).toHaveClass(/light/);
	await page.reload();
	await expect(page.getByRole('button', { name: 'Switch to dark theme' })).toBeVisible();
	await expect(page.locator('html')).toHaveClass(/light/);
});

test('scrolls smoothly to the top and respects reduced motion', async ({ page }) => {
	await page.goto('/');
	await expect
		.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior))
		.toBe('smooth');

	await page
		.getByRole('navigation', { name: 'Footer navigation' })
		.getByRole('link', { name: 'Back to top ↑' })
		.click();
	await expect(page).toHaveURL(/#top$/);
	await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

	await page.emulateMedia({ reducedMotion: 'reduce' });
	await expect
		.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior))
		.toBe('auto');
});

test('serves the German homepage and switches languages', async ({ page }) => {
	const response = await page.goto('/de');
	expect(await response?.text()).toContain('<html lang="de">');
	await expect(page).toHaveTitle('Momentum — Kampagnen mit mehr Klarheit voranbringen');
	await expect(page.locator('html')).toHaveAttribute('lang', 'de');
	const accessibility = await new AxeBuilder({ page }).analyze();
	expect(
		accessibility.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
	).toEqual([]);
	await expect(
		page.getByRole('heading', { level: 2, name: 'Alles am richtigen Platz.' })
	).toBeVisible();
	await expect(
		page.getByRole('heading', { level: 2, name: 'Wachse in deinem Tempo.' })
	).toBeVisible();
	await expect(
		page.getByRole('heading', { level: 2, name: 'Ein wenig mehr Klarheit verändert viel.' })
	).toBeVisible();
	await expect(
		page
			.getByRole('navigation', { name: 'Fußnavigation' })
			.getByRole('link', { name: 'Zurück nach oben ↑' })
	).toHaveAttribute('href', '/de#top');
	await page.getByRole('link', { name: 'Englisch' }).click();
	await expect(page).toHaveURL('/');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await page.getByRole('link', { name: 'German' }).click();
	await expect(page).toHaveURL('/de');
	await expect(page.locator('html')).toHaveAttribute('lang', 'de');
	await expect(page).toHaveTitle('Momentum — Kampagnen mit mehr Klarheit voranbringen');
});
