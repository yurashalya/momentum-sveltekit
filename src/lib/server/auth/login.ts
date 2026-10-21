import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { loginSchema } from '#lib/features/auth/schema.js';
import { loginFieldErrors } from '#lib/features/auth/validation.js';
import { authenticate } from '#lib/server/data/users.js';
import { setSession } from './session.js';

const safeDashboardDestination = (
	next: string | null,
	fallback: '/dashboard' | '/de/dashboard'
) => {
	if (!next?.startsWith('/') || next.startsWith('//')) return fallback;
	try {
		const destination = new URL(next, 'http://momentum.local');
		if (!/^\/(?:de\/)?dashboard(?:\/|$)/.test(destination.pathname)) return fallback;
		return `${destination.pathname}${destination.search}`;
	} catch {
		return fallback;
	}
};

export const signIn = async ({ request, cookies, url }: RequestEvent) => {
	const form = await request.formData();
	const email = form.get('email');
	const parsed = loginSchema.safeParse({ email, password: form.get('password') });
	if (!parsed.success) {
		return fail(400, {
			email: typeof email === 'string' ? email.slice(0, 254) : '',
			errors: loginFieldErrors(parsed.error.issues)
		});
	}

	const user = authenticate(parsed.data.email, parsed.data.password);
	if (!user) return fail(400, { email: parsed.data.email, invalidCredentials: true });

	setSession(cookies, user.id, url.protocol === 'https:');
	const fallback = url.pathname === '/de/login' ? '/de/dashboard' : '/dashboard';
	redirect(303, safeDashboardDestination(url.searchParams.get('next'), fallback));
};
