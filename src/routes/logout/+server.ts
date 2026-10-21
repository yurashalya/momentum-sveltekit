import { redirect, type RequestHandler } from '@sveltejs/kit';
import { clearSession } from '#lib/server/auth/session.js';
import { LOCALE } from '#lib/i18n/index.js';

export const POST: RequestHandler = ({ cookies, url }) => {
	clearSession(cookies);
	redirect(303, url.searchParams.get('locale') === LOCALE.DE ? '/de/login' : '/login');
};
