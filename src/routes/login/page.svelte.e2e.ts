import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('redirects anonymous visitors and validates the sign-in form on both sides', async ({
	page
}) => {
	await page.goto('/dashboard');
	await expect(page).toHaveURL('/login?next=%2Fdashboard');
	await expect(page.getByRole('heading', { level: 1, name: 'Sign in' })).toBeVisible();

	await page.getByRole('textbox', { name: 'Email' }).fill('invalid-address');
	await page.getByLabel('Password').fill('demo1234');
	await page.getByRole('button', { name: 'Sign in' }).click();
	await expect(page.getByText('Enter a valid email address.')).toBeVisible();
	await expect(page).toHaveURL('/login?next=%2Fdashboard');

	await page.getByRole('textbox', { name: 'Email' }).fill('editor@demo.test');
	await page.getByLabel('Password').fill('wrong-password');
	await page.getByRole('button', { name: 'Sign in' }).click();
	await expect(page.getByRole('alert')).toHaveText('Invalid email or password.');
	await expect(page.getByLabel('Password')).toHaveValue('');
	await expect(page).toHaveURL('/login?next=%2Fdashboard');

	const accessibility = await new AxeBuilder({ page }).analyze();
	expect(
		accessibility.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
	).toEqual([]);
});

test('signs in, persists an HttpOnly session, and signs out', async ({ page, context }) => {
	await page.goto('/dashboard');
	await page.getByRole('textbox', { name: 'Email' }).fill('editor@demo.test');
	await page.getByLabel('Password').fill('demo1234');
	await page.getByRole('button', { name: 'Sign in' }).click();
	await expect(page).toHaveURL('/dashboard');
	await expect(page.getByText('Welcome back, Demo Editor.')).toBeVisible();

	const session = (await context.cookies()).find((cookie) => cookie.name === 'momentum_session');
	expect(session).toMatchObject({ httpOnly: true, sameSite: 'Lax', path: '/' });
	await page.reload();
	await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();

	const accessibility = await new AxeBuilder({ page }).analyze();
	expect(
		accessibility.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
	).toEqual([]);

	await page.getByRole('button', { name: 'Sign out' }).click();
	await expect(page).toHaveURL('/login');
	await page.goto('/dashboard');
	await expect(page).toHaveURL('/login?next=%2Fdashboard');
});

test('localizes login and rejects an external return URL', async ({ page }) => {
	await page.goto('/de/login');
	await expect(page.locator('html')).toHaveAttribute('lang', 'de');
	await expect(page.getByRole('heading', { level: 1, name: 'Anmelden' })).toBeVisible();
	await page.getByRole('link', { name: 'Englisch' }).click();
	await expect(page).toHaveURL('/login');

	await page.goto('/login?next=https%3A%2F%2Fexample.com');
	await page.getByRole('textbox', { name: 'Email' }).fill('viewer@demo.test');
	await page.getByLabel('Password').fill('demo1234');
	await page.getByRole('button', { name: 'Sign in' }).click();
	await expect(page).toHaveURL('/dashboard');
});

test('keeps the German locale through dashboard access and sign-out', async ({ page }) => {
	await page.goto('/de/dashboard');
	await expect(page).toHaveURL('/de/login?next=%2Fde%2Fdashboard');
	await expect(page.locator('html')).toHaveAttribute('lang', 'de');
	await page.getByRole('textbox', { name: 'E-Mail' }).fill('editor@demo.test');
	await page.getByLabel('Passwort').fill('demo1234');
	await page.getByRole('button', { name: 'Anmelden' }).click();
	await expect(page).toHaveURL('/de/dashboard');
	await expect(page.getByText('Momentum-Arbeitsbereich')).toBeVisible();
	await expect(page.getByText('Willkommen zurück, Demo Editor.')).toBeVisible();
	await expect(page.getByRole('link', { name: 'Momentum' })).toHaveAttribute('href', '/de');

	await page.getByRole('link', { name: 'EN', exact: true }).click();
	await expect(page).toHaveURL('/dashboard');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await page.getByRole('link', { name: 'DE', exact: true }).click();
	await expect(page).toHaveURL('/de/dashboard');
	await page.getByRole('button', { name: 'Abmelden' }).click();
	await expect(page).toHaveURL('/de/login');
	await page.goto('/de/dashboard');
	await expect(page).toHaveURL('/de/login?next=%2Fde%2Fdashboard');
});

test('updates the dashboard return path when switching login language', async ({ page }) => {
	await page.goto('/de/dashboard');
	await expect(page).toHaveURL('/de/login?next=%2Fde%2Fdashboard');
	await page.getByRole('link', { name: 'Englisch' }).click();
	await expect(page).toHaveURL('/login?next=%2Fdashboard');
	await page.getByRole('textbox', { name: 'Email' }).fill('viewer@demo.test');
	await page.getByLabel('Password').fill('demo1234');
	await page.getByRole('button', { name: 'Sign in' }).click();
	await expect(page).toHaveURL('/dashboard');
});

test('shows and clears field errors before submitting', async ({ page }) => {
	await page.goto('/login');
	const email = page.getByRole('textbox', { name: 'Email' });
	const password = page.getByLabel('Password');

	await email.fill('ewerefewfw');
	await expect(page.getByText('Enter a valid email address.')).toBeVisible();
	await expect(email).toHaveAttribute('aria-invalid', 'true');
	await email.fill('editor@demo.test');
	await expect(page.getByText('Enter a valid email address.')).not.toBeVisible();

	await password.fill('demo 1234');
	await expect(page.getByText('Password cannot contain spaces.')).toBeVisible();
	await password.fill('demo1234');
	await expect(page.getByText('Password cannot contain spaces.')).not.toBeVisible();

	await email.fill('');
	await email.blur();
	await expect(page.getByText('Enter a valid email address.')).toBeVisible();
	await expect(page).toHaveURL('/login');
});

test('validates email and password constraints in the form and server action', async ({
	page,
	request
}) => {
	await page.goto('/login');
	const email = page.getByRole('textbox', { name: 'Email' });
	const password = page.getByLabel('Password');
	await expect(password).toHaveAttribute('maxlength', '50');
	await email.fill('not-an-email');
	await password.fill('demo1234');
	await page.getByRole('button', { name: 'Sign in' }).click();
	await expect(page.getByText('Enter a valid email address.')).toBeVisible();

	await email.fill('editor@demo.test');
	await password.fill('demo 1234');
	await page.getByRole('button', { name: 'Sign in' }).click();
	await expect(page.getByText('Password cannot contain spaces.')).toBeVisible();
	await expect(page).toHaveURL('/login');

	const submitToServer = (email: string, password: string) =>
		request.post('/login', {
			form: { email, password },
			headers: { origin: new URL(page.url()).origin, accept: 'text/html' }
		});

	const invalidEmail = await submitToServer('not-an-email', 'demo1234');
	expect(invalidEmail.status()).toBe(400);
	expect(await invalidEmail.text()).toContain('Enter a valid email address.');

	const spacedPassword = await submitToServer('editor@demo.test', 'demo 1234');
	expect(spacedPassword.status()).toBe(400);
	expect(await spacedPassword.text()).toContain('Password cannot contain spaces.');

	const longPassword = await submitToServer('editor@demo.test', 'a'.repeat(51));
	expect(longPassword.status()).toBe(400);
	expect(await longPassword.text()).toContain('Password must be 50 characters or fewer.');

	await page.goto('/de/login');
	await expect(page.getByText('Bis zu 50 Zeichen, keine Leerzeichen.')).toBeVisible();
	await page.getByRole('textbox', { name: 'E-Mail' }).fill('editor@demo.test');
	await page.getByLabel('Passwort').fill('demo 1234');
	await expect(page.getByText('Das Passwort darf keine Leerzeichen enthalten.')).toBeVisible();
	await page.getByRole('button', { name: 'Anmelden' }).click();
	await expect(page.getByText('Das Passwort darf keine Leerzeichen enthalten.')).toBeVisible();
});
