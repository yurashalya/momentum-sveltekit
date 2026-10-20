import { resolve } from '$app/paths';
import type { TranslationKey, Locale } from '#lib/i18n/index.js';
import { blogHref } from '#lib/i18n/hrefs.js';
import { localeHomePath } from '#lib/i18n/paths.js';

type PublicLink = {
	href: `#${string}` | 'blog';
	labelKey: TranslationKey;
};

export const publicNavigationLinks = [
	{ href: '#features', labelKey: 'nav.features' },
	{ href: '#pricing', labelKey: 'nav.pricing' },
	{ href: '#stories', labelKey: 'nav.stories' },
	{ href: 'blog', labelKey: 'nav.blog' }
] as const satisfies readonly PublicLink[];

export const footerLinks = [
	...publicNavigationLinks,
	{ href: '#top', labelKey: 'nav.backToTop' }
] as const satisfies readonly PublicLink[];

export const publicLinkHref = (locale: Locale, href: PublicLink['href']) =>
	href === 'blog' ? blogHref(locale) : resolve(`${localeHomePath(locale)}${href}`);
