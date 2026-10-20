import type { Handle } from '@sveltejs/kit/hooks';
import { defaultLocale } from '#lib/i18n/index.js';
import { localeFromPath } from '#lib/i18n/paths.js';

export const handle: Handle = async ({ event, resolve }) => {
	const locale = localeFromPath(event.url.pathname);

	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace(`<html lang="${defaultLocale}">`, `<html lang="${locale}">`)
	});
};
