import en from '../../../mocks/i18n.en.json';
import de from '../../../mocks/i18n.de.json';

export const LOCALE = {
	EN: 'en',
	DE: 'de'
} as const;

export type Locale = (typeof LOCALE)[keyof typeof LOCALE];
export type TranslationKey = keyof typeof en;
export type TranslationDictionary = Record<TranslationKey, string>;

const dictionaries = {
	[LOCALE.EN]: en,
	[LOCALE.DE]: de
} satisfies Record<Locale, TranslationDictionary>;

export const locales: readonly Locale[] = Object.freeze(Object.values(LOCALE));
export const defaultLocale: Locale = LOCALE.EN;

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

export const formatCurrency = (value: number, locale: Locale) => {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0
	}).format(value);
};
