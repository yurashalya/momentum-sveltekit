import { defaultLocale, LOCALE, locales, type Locale } from './index.js';

export const localeHomePaths = {
	[LOCALE.EN]: '/',
	[LOCALE.DE]: '/de'
} as const satisfies Record<Locale, `/${string}`>;

export const localeHomePath = (locale: Locale) => localeHomePaths[locale];

export const localeFromPath = (pathname: string): Locale => {
	for (const locale of locales) {
		const homePath = localeHomePath(locale);
		if (homePath !== '/' && (pathname === homePath || pathname.startsWith(`${homePath}/`))) {
			return locale;
		}
	}

	return defaultLocale;
};
