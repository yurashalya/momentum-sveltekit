import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const signIn = async (page: import('@playwright/test').Page, email = 'editor@demo.test') => {
	await page.getByRole('textbox', { name: 'Email' }).fill(email);
	await page.getByLabel('Password').fill('demo1234');
	await page.getByRole('button', { name: 'Sign in' }).click();
};

test('guards campaign rows and keeps filters, sorting, and pagination in the URL', async ({
	page
}) => {
	await page.goto('/dashboard/items');
	await expect(page).toHaveURL('/login?next=%2Fdashboard%2Fitems');
	await signIn(page);
	await expect(page).toHaveURL('/dashboard/items');
	await expect(page.getByRole('heading', { level: 1, name: 'Campaigns' })).toBeVisible();
	await expect(
		page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Dashboard' })
	).toHaveAttribute('href', '/dashboard');
	await expect(page.locator('tbody tr')).toHaveCount(20);
	await expect(page.getByText('Showing 1–20 of 220 campaigns')).toBeVisible();

	await page.getByRole('link', { name: 'Next' }).click();
	await expect(page).toHaveURL('/dashboard/items?page=2');
	await expect(page.getByText('Page 2 of 11')).toBeVisible();

	await page.getByRole('combobox', { name: 'Status' }).click();
	await page.getByRole('option', { name: 'Active', exact: true }).click();
	await page.getByRole('button', { name: 'Apply filters' }).click();
	await expect(page).toHaveURL('/dashboard/items?status=active');
	await expect(page.locator('tbody tr')).toHaveCount(20);
	await expect(page.getByText('Showing 1–20 of 72 campaigns')).toBeVisible();

	await page.getByRole('link', { name: /Budget/ }).click();
	await expect(page).toHaveURL('/dashboard/items?status=active&sort=budget&dir=asc');
	await expect(page.locator('th[aria-sort="ascending"]')).toContainText('Budget');

	await page
		.getByRole('searchbox', { name: 'Search campaigns' })
		.fill('no-campaign-with-this-name');
	await page.getByRole('button', { name: 'Apply filters' }).click();
	await expect(page.getByText('No campaigns yet.')).toBeVisible();
	await expect(page.getByText('Showing 0–0 of 0 campaigns')).toBeVisible();

	await page.getByRole('link', { name: 'DE', exact: true }).click();
	await expect(page).toHaveURL(/\/de\/dashboard\/items\?/);
	await expect(page.getByRole('heading', { level: 1, name: 'Kampagnen' })).toBeVisible();
	await page
		.getByRole('navigation', { name: 'Brotkrumennavigation' })
		.getByRole('link', { name: 'Dashboard' })
		.click();
	await expect(page).toHaveURL('/de/dashboard');
});

test('edits a name optimistically and restores it after an archived campaign rejects the change', async ({
	page
}) => {
	await page.goto('/dashboard/items?status=active');
	await signIn(page);
	await expect(page).toHaveURL('/dashboard/items?status=active');
	const row = page.locator('tbody tr').first();
	const originalName = (
		await row.locator('td').first().locator('span.font-semibold').textContent()
	)?.trim();
	expect(originalName).toBeTruthy();
	await row.getByRole('button', { name: `Edit name: ${originalName}` }).click();
	await row.getByRole('textbox', { name: 'Name' }).fill('E2E renamed campaign');
	await row.getByRole('button', { name: 'Save' }).click();
	await expect(row.getByText('E2E renamed campaign')).toBeVisible();
	await expect(row.getByText('Saving…')).toBeVisible();
	await expect(
		page.getByRole('status').filter({ hasText: 'Campaign name updated.' })
	).toBeVisible();
	await page.reload();
	await expect(page.locator('tbody tr').first()).toContainText('E2E renamed campaign');

	const editedRow = page.locator('tbody tr').first();
	await editedRow.getByRole('button', { name: 'Edit name: E2E renamed campaign' }).click();
	await editedRow.getByRole('textbox', { name: 'Name' }).fill(originalName!);
	await editedRow.getByRole('button', { name: 'Save' }).click();
	await expect(
		page.getByRole('status').filter({ hasText: 'Campaign name updated.' })
	).toBeVisible();

	await page.goto('/dashboard/items?status=archived');
	const archivedRow = page.locator('tbody tr').first();
	const archivedName = (
		await archivedRow.locator('td').first().locator('span.font-semibold').textContent()
	)?.trim();
	expect(archivedName).toBeTruthy();
	await archivedRow.getByRole('button', { name: `Edit name: ${archivedName}` }).click();
	await archivedRow.getByRole('textbox', { name: 'Name' }).fill('This must roll back');
	await archivedRow.getByRole('button', { name: 'Save' }).click();
	await expect(archivedRow.getByText('This must roll back')).toBeVisible();
	await expect(page.getByRole('alert')).toContainText('Archived campaigns cannot be renamed.');
	await expect(archivedRow.getByText(archivedName!)).toBeVisible();

	const accessibility = await new AxeBuilder({ page }).analyze();
	expect(
		accessibility.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
	).toEqual([]);
});

test('keeps viewer accounts read-only and rejects mutation requests', async ({ page, request }) => {
	const anonymous = await request.patch('/api/campaigns/cmp_0001', {
		data: { name: 'Not allowed' }
	});
	expect(anonymous.status()).toBe(401);

	await page.goto('/dashboard/items');
	await signIn(page, 'viewer@demo.test');
	await expect(page.locator('tbody tr')).toHaveCount(20);
	await expect(page.getByRole('button', { name: /Edit name/ })).toHaveCount(0);
	const denied = await page.request.patch('/api/campaigns/cmp_0001', {
		data: { name: 'Not allowed' }
	});
	expect(denied.status()).toBe(403);
});
