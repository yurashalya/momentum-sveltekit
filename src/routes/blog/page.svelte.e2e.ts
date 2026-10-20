import { expect, test } from '@playwright/test';

test('paginates posts and preserves the page when switching language', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/en/blog');
	await expect(page).toHaveTitle('Writing — Momentum');
	await expect(page.getByRole('heading', { level: 1, name: 'Writing' })).toBeVisible();
	await expect(page.locator('article')).toHaveCount(6);
	await page
		.getByRole('navigation', { name: 'Blog pages' })
		.getByRole('link', { name: 'Next' })
		.click();
	await expect(page).toHaveURL('/en/blog/page/2#blog-posts');
	await expect(page.locator('article')).toHaveCount(6);
	await expect
		.poll(() =>
			page
				.locator('#blog-posts')
				.evaluate((section) => Math.abs(section.getBoundingClientRect().top) < 2)
		)
		.toBe(true);
	await page.getByRole('link', { name: 'German' }).click();
	await expect(page).toHaveURL('/de/blog/page/2');
	await expect(page.locator('html')).toHaveAttribute('lang', 'de');
	await expect(page).toHaveTitle('Seite 2 — Texte — Momentum');
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /de\/blog\/page\/2$/);
	await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
		'href',
		/en\/blog\/page\/2$/
	);
});

test('opens a localized article with valid structured data and keeps its slug', async ({
	page
}) => {
	await page.goto('/de/blog');
	const article = page.locator('article').first();
	const articleTitle = await article.getByRole('heading', { level: 2 }).textContent();
	await article.getByRole('link', { name: articleTitle?.trim(), exact: true }).click();
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(articleTitle?.trim() ?? '');
	await expect(page.locator('html')).toHaveAttribute('lang', 'de');
	const germanUrl = page.url();
	const structuredData = JSON.parse(
		(await page.locator('script[type="application/ld+json"]').textContent()) ?? ''
	);
	expect(structuredData['@graph'].map((item: { '@type': string }) => item['@type'])).toEqual([
		'Article',
		'BreadcrumbList'
	]);
	expect(structuredData['@graph'][0].headline).toBe(articleTitle?.trim());
	await page.getByRole('link', { name: 'Englisch' }).click();
	await expect(page).toHaveURL(germanUrl.replace('/de/blog/', '/en/blog/'));
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveAttribute(
		'href',
		/de\/blog\//
	);
});

test('redirects the short blog URL and rejects missing posts and pages', async ({ page }) => {
	await page.goto('/blog');
	await expect(page).toHaveURL('/en/blog');
	for (const path of ['/en/blog/does-not-exist', '/de/blog/page/5', '/en/blog/page/1']) {
		const response = await page.goto(path);
		expect(response?.status()).toBe(404);
	}
});
