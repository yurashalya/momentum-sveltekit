import { resolve } from '$app/paths';
import type { Locale } from './index.js';
import { localeHomePath } from './paths.js';

export const blogHref = (locale: Locale) => resolve('/[locale=locale]/blog', { locale });

export const blogPageHref = (locale: Locale, page: number) =>
	page === 1
		? blogHref(locale)
		: resolve('/[locale=locale]/blog/page/[page]', { locale, page: String(page) });

export const blogPagePostsHref = (locale: Locale, page: number) =>
	page === 1
		? resolve('/[locale=locale]/blog#blog-posts', { locale })
		: resolve('/[locale=locale]/blog/page/[page]#blog-posts', {
				locale,
				page: String(page)
			});

export const postHref = (locale: Locale, slug: string) =>
	resolve('/[locale=locale]/blog/[slug]', { locale, slug });

export const alternateLocaleHref = (
	routeId: string | null,
	params: Record<string, string>,
	locale: Locale
) => {
	if (routeId === '/[locale=locale]/blog/[slug]' && params.slug) {
		return postHref(locale, params.slug);
	}
	if (routeId === '/[locale=locale]/blog/page/[page]' && params.page) {
		return blogPageHref(locale, Number(params.page));
	}
	if (routeId === '/[locale=locale]/blog') return blogHref(locale);
	return resolve(localeHomePath(locale));
};
