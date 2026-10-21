import { resolve } from '$app/paths';
import { LOCALE, type Locale } from './index.js';
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

export const searchHref = (locale: Locale, searchParams?: { toString(): string }) => {
	const query = searchParams?.toString();
	if (!query) return locale === LOCALE.DE ? resolve('/de/search') : resolve('/search');
	return locale === LOCALE.DE ? resolve(`/de/search?${query}`) : resolve(`/search?${query}`);
};

export const dashboardHref = (locale: Locale) =>
	locale === LOCALE.DE ? resolve('/de/dashboard') : resolve('/dashboard');

export const dashboardItemsHref = (locale: Locale, searchParams?: { toString(): string }) => {
	const path = locale === LOCALE.DE ? '/de/dashboard/items' : '/dashboard/items';
	const query = searchParams?.toString();
	return resolve(query ? `${path}?${query}` : path);
};

export const loginHref = (locale: Locale, searchParams?: { toString(): string }) => {
	const params = new URLSearchParams(searchParams?.toString());
	const next = params.get('next');
	if (next && /^\/(?:de\/)?dashboard(?=\/|\?|$)/.test(next)) {
		params.set(
			'next',
			next.replace(/^\/(?:de\/)?dashboard/, locale === LOCALE.DE ? '/de/dashboard' : '/dashboard')
		);
	}
	const query = params.toString();
	if (!query) return locale === LOCALE.DE ? resolve('/de/login') : resolve('/login');
	return locale === LOCALE.DE ? resolve(`/de/login?${query}`) : resolve(`/login?${query}`);
};

export const postHref = (locale: Locale, slug: string) =>
	resolve('/[locale=locale]/blog/[slug]', { locale, slug });

export const alternateLocaleHref = (
	routeId: string | null,
	params: Record<string, string>,
	locale: Locale,
	searchParams?: { toString(): string }
) => {
	if (routeId === '/[locale=locale]/blog/[slug]' && params.slug) {
		return postHref(locale, params.slug);
	}
	if (routeId === '/[locale=locale]/blog/page/[page]' && params.page) {
		return blogPageHref(locale, Number(params.page));
	}
	if (routeId === '/[locale=locale]/blog') return blogHref(locale);
	if (routeId === '/search' || routeId === '/de/search') return searchHref(locale, searchParams);
	if (routeId === '/login' || routeId === '/de/login') return loginHref(locale, searchParams);
	return resolve(localeHomePath(locale));
};
