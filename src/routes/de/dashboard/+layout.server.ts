import type { LayoutServerLoad } from './$types';
import { requireDashboardUser } from '#lib/server/auth/guard.js';

export const prerender = false;

export const load: LayoutServerLoad = ({ locals, url, setHeaders }) => {
	setHeaders({ 'cache-control': 'private, no-store' });
	return requireDashboardUser(locals.user, url, '/de/login');
};
