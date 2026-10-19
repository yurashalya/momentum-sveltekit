import en from '../../../mocks/i18n.en.json';
import de from '../../../mocks/i18n.de.json';

export type TranslationKey = keyof typeof en;
export type TranslationDictionary = Record<TranslationKey, string>;

const dictionaries = {
	en,
	de
} satisfies Record<string, TranslationDictionary>;

export type Locale = keyof typeof dictionaries;
export const locales: readonly Locale[] = Object.freeze(Object.keys(dictionaries) as Locale[]);
export const defaultLocale: Locale = 'en';

export const isLocale = (value: string): value is Locale => {
	return Object.hasOwn(dictionaries, value);
};

export const dictionary = (locale: Locale): TranslationDictionary => {
	return dictionaries[locale];
};

export const t = (
	locale: Locale,
	key: TranslationKey,
	values: Record<string, string | number> = {}
) => {
	let value = dictionary(locale)[key];
	for (const [name, replacement] of Object.entries(values)) {
		value = value.replaceAll(`{${name}}`, String(replacement));
	}
	return value;
};

export const formatDate = (value: string, locale: Locale) => {
	return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(
		new Date(value)
	);
};

export const formatNumber = (value: number, locale: Locale) => {
	return new Intl.NumberFormat(locale).format(value);
};
