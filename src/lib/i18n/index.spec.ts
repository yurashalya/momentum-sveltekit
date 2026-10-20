import { describe, expect, it } from 'vitest';
import { defaultLocale, dictionary, isLocale, LOCALE, locales, t } from './index.js';

describe('locale registry', () => {
	it('derives supported locales from registered dictionaries', () => {
		expect(locales).toEqual(['en', 'de']);
		expect(defaultLocale).toBe('en');
		expect(isLocale(LOCALE.DE)).toBe(true);
		expect(isLocale('fr')).toBe(false);
		expect(isLocale('toString')).toBe(false);
	});

	it('keeps dictionary keys aligned and interpolates the selected language', () => {
		expect(Object.keys(dictionary(LOCALE.DE)).sort()).toEqual(
			Object.keys(dictionary(LOCALE.EN)).sort()
		);
		expect(t(LOCALE.EN, 'blog.readingTime', { minutes: 5 })).toBe('5 min read');
		expect(t(LOCALE.DE, 'blog.readingTime', { minutes: 5 })).toBe('5 Min. Lesezeit');
	});
});
