import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { signIn } from '#lib/server/auth/login.js';

export const prerender = false;

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user) redirect(303, '/de/dashboard');
	return {};
};

export const actions: Actions = { default: signIn };
