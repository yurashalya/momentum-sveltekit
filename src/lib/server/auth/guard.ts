import { redirect } from '@sveltejs/kit';
import type { PublicUser } from '#lib/features/auth/schema.js';

export const requireDashboardUser = (
	user: PublicUser | null,
	url: URL,
	loginPath: '/login' | '/de/login'
) => {
	if (!user) {
		const next = encodeURIComponent(`${url.pathname}${url.search}`);
		redirect(303, `${loginPath}?next=${next}`);
	}
	return { user };
};
