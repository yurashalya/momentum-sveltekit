import { defaultLocale, LOCALE, locales, type Locale } from './index.js';

export const localeHomePaths = {
	[LOCALE.EN]: '/',
	[LOCALE.DE]: '/de'
} as const satisfies Record<Locale, `/${string}`>;

export const localeHomePath = (locale: Locale) => localeHomePaths[locale];

export const localeBlogPaths = {
	[LOCALE.EN]: '/en/blog',
	[LOCALE.DE]: '/de/blog'
} as const satisfies Record<Locale, `/${string}`>;

export const localeBlogPath = (locale: Locale) => localeBlogPaths[locale];

export const localeFromPath = (pathname: string): Locale => {
	for (const locale of locales) {
		const homePath = localeHomePath(locale);
		if (homePath !== '/' && (pathname === homePath || pathname.startsWith(`${homePath}/`))) {
			return locale;
		}
	}

	return defaultLocale;
};
