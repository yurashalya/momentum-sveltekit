import type { LayoutServerLoad } from './$types';
import { requireDashboardUser } from '#lib/server/auth/guard.js';

export const prerender = false;

export const load: LayoutServerLoad = ({ locals, url }) =>
	requireDashboardUser(locals.user, url, '/login');
