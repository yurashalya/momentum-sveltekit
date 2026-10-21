import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('serves an English 404 with recovery links', async ({ page }) => {
	const response = await page.goto('/this-page-does-not-exist');
	expect(response?.status()).toBe(404);
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(page).toHaveTitle('Page not found — Momentum');
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,follow');
	await expect(
		page.getByRole('heading', { level: 1, name: 'This page is off the map.' })
	).toBeVisible();
	await expect(page.getByRole('link', { name: 'Back to homepage' })).toHaveAttribute('href', '/');
	await expect(page.getByRole('link', { name: 'Explore the blog' })).toHaveAttribute(
		'href',
		'/en/blog'
	);

	expect(
		await page.locator('.error-art').evaluate((element) => element.getBoundingClientRect().height)
	).toBeGreaterThan(280);

	await page.getByRole('link', { name: 'Back to homepage' }).click();
	await expect(page).toHaveURL('/');

	const named404Response = await page.goto('/404');
	expect(named404Response?.status()).toBe(404);
	await expect(
		page.getByRole('heading', { level: 1, name: 'This page is off the map.' })
	).toBeVisible();
});

test('serves a German 404 in both themes and recovers to the blog', async ({ page }) => {
	const response = await page.goto('/de/diese-seite-gibt-es-nicht');
	expect(response?.status()).toBe(404);
	expect(await response?.text()).toContain('<html lang="de">');
	await expect(page).toHaveTitle('Seite nicht gefunden — Momentum');
	await expect(
		page.getByRole('heading', { level: 1, name: 'Diese Seite gibt es hier nicht.' })
	).toBeVisible();
	await expect(page.getByRole('link', { name: 'Zur Startseite' })).toHaveAttribute('href', '/de');
	await expect(page.getByRole('link', { name: 'Zum Blog' })).toHaveAttribute('href', '/de/blog');

	const accessibility = await new AxeBuilder({ page }).analyze();
	expect(
		accessibility.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
	).toEqual([]);

	await page.getByRole('button', { name: 'Zum hellen Design wechseln' }).click();
	await expect(page.locator('html')).toHaveClass(/light/);
	await page.setViewportSize({ width: 390, height: 844 });
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
	await page.getByRole('link', { name: 'Zum Blog' }).click();
	await expect(page).toHaveURL('/de/blog');
});

test('uses the same localized 404 for a missing blog post', async ({ page }) => {
	const response = await page.goto('/de/blog/unknown-post');
	expect(response?.status()).toBe(404);
	await expect(page).toHaveTitle('Seite nicht gefunden — Momentum');
	await expect(
		page.getByRole('heading', { level: 1, name: 'Diese Seite gibt es hier nicht.' })
	).toBeVisible();
});
