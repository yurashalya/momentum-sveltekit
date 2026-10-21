import { resolve } from '$app/paths';
import type { TranslationKey, Locale } from '#lib/i18n/index.js';
import { blogHref, searchHref } from '#lib/i18n/hrefs.js';
import { localeHomePath } from '#lib/i18n/paths.js';

type PublicLink = {
	href: `#${string}` | 'blog' | 'search';
	labelKey: TranslationKey;
};

export const publicNavigationLinks = [
	{ href: '#features', labelKey: 'nav.features' },
	{ href: '#pricing', labelKey: 'nav.pricing' },
	{ href: '#stories', labelKey: 'nav.stories' },
	{ href: 'blog', labelKey: 'nav.blog' },
	{ href: 'search', labelKey: 'nav.search' }
] as const satisfies readonly PublicLink[];

export const footerLinks = [
	...publicNavigationLinks,
	{ href: '#top', labelKey: 'nav.backToTop' }
] as const satisfies readonly PublicLink[];

export const publicLinkHref = (locale: Locale, href: PublicLink['href']) => {
	if (href === 'blog') return blogHref(locale);
	if (href === 'search') return searchHref(locale);
	return resolve(`${localeHomePath(locale)}${href}`);
};
