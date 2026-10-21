import type { Handle } from '@sveltejs/kit/hooks';
import { defaultLocale } from '#lib/i18n/index.js';
import { localeFromPath } from '#lib/i18n/paths.js';
import { getSessionUser } from '#lib/server/auth/session.js';

export const handle: Handle = async ({ event, resolve }) => {
	const locale = localeFromPath(event.url.pathname);
	event.locals.user = getSessionUser(event.cookies) ?? null;

	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace(`<html lang="${defaultLocale}">`, `<html lang="${locale}">`)
	});
};
