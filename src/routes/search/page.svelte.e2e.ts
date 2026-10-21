import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('searches, filters, switches language with URL state, and opens a post', async ({ page }) => {
	await page.goto('/search');
	await expect(page.locator('article')).toHaveCount(20);
	await page.getByRole('searchbox', { name: 'Keywords' }).fill('combobox');
	await page.getByRole('combobox', { name: 'Topic' }).click();
	await page.getByRole('option', { name: 'Accessibility' }).click();
	await page.getByRole('combobox', { name: 'Sort by' }).click();
	await page.getByRole('option', { name: 'Title A–Z' }).click();
	await page.getByRole('button', { name: 'Show results' }).click();
	await expect(page).toHaveURL('/search?q=combobox&tag=accessibility&sort=title');
	await expect(page.locator('article')).toHaveCount(1);
	await expect(page.getByRole('status')).toContainText('1 results for "combobox"');
	await page.getByRole('link', { name: 'German' }).click();
	await expect(page).toHaveURL('/de/search?q=combobox&tag=accessibility&sort=title');
	await expect(page.locator('html')).toHaveAttribute('lang', 'de');
	await expect(page.getByRole('searchbox', { name: 'Stichwörter' })).toHaveValue('combobox');
	await expect(page.getByRole('combobox', { name: 'Thema' })).toContainText('Barrierefreiheit');
	await expect(page.getByRole('combobox', { name: 'Sortieren nach' })).toContainText('Titel A–Z');
	await expect(page.locator('input[name=tag]')).toHaveValue('accessibility');
	await expect(page.locator('input[name=sort]')).toHaveValue('title');
	await page
		.locator('article')
		.getByRole('link', { name: /Eine zugängliche Combobox/ })
		.first()
		.click();
	await expect(page).toHaveURL('/de/blog/accessible-combobox-from-scratch');
	await expect(page.getByRole('heading', { level: 1 })).toContainText('Eine zugängliche Combobox');
});

test('restores filters with browser history and offers an empty state', async ({ page }) => {
	await page.goto('/search');
	await page.getByRole('searchbox', { name: 'Keywords' }).fill('unlikely-phrase-with-no-post');
	await page.getByRole('button', { name: 'Show results' }).click();
	await expect(page).toHaveURL('/search?q=unlikely-phrase-with-no-post');
	await expect(page.getByRole('heading', { name: 'No posts match these filters' })).toBeVisible();
	await expect(page.locator('article')).toHaveCount(0);
	await page.getByRole('link', { name: 'Clear filters' }).first().click();
	await expect(page).toHaveURL('/search');
	await expect(page.locator('article')).toHaveCount(20);
	await page.goBack();
	await expect(page).toHaveURL('/search?q=unlikely-phrase-with-no-post');
	await expect(page.getByRole('searchbox', { name: 'Keywords' })).toHaveValue(
		'unlikely-phrase-with-no-post'
	);
	await page.goForward();
	await expect(page).toHaveURL('/search');
	await expect(page.getByRole('searchbox', { name: 'Keywords' })).toHaveValue('');
});

test('normalizes unsupported filters to a shareable URL', async ({ page }) => {
	const response = await page.goto('/search?q=%20combobox%20&tag=missing&sort=unknown&extra=1');
	expect(response?.status()).toBe(200);
	await expect(page).toHaveURL('/search?q=combobox');
	await expect(page.locator('article')).toHaveCount(1);
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,follow');
});

test('styled dropdown supports keyboard selection and Escape', async ({ page }) => {
	await page.goto('/search');
	const topic = page.getByRole('combobox', { name: 'Topic' });
	await topic.focus();
	await topic.press('ArrowDown');
	await expect(page.getByRole('listbox', { name: 'Topic' })).toBeVisible();
	const accessibility = await new AxeBuilder({ page }).analyze();
	expect(
		accessibility.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
	).toEqual([]);
	await topic.press('ArrowDown');
	await expect(topic).toHaveAttribute('aria-activedescendant', 'search-tag-option-1');
	await topic.press('Enter');
	await expect(page.locator('input[name=tag]')).toHaveValue('engineering');
	await expect(page.getByRole('listbox', { name: 'Topic' })).toBeHidden();
	await topic.press('Space');
	await expect(page.getByRole('listbox', { name: 'Topic' })).toBeVisible();
	await topic.press('Escape');
	await expect(page.getByRole('listbox', { name: 'Topic' })).toBeHidden();
});
