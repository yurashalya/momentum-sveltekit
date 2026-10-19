import { describe, expect, it } from 'vitest';
import { defaultLocale, dictionary, isLocale, locales, t } from './index.js';

describe('locale registry', () => {
	it('derives supported locales from registered dictionaries', () => {
		expect(locales).toEqual(['en', 'de']);
		expect(defaultLocale).toBe('en');
		expect(isLocale('de')).toBe(true);
		expect(isLocale('fr')).toBe(false);
		expect(isLocale('toString')).toBe(false);
	});

	it('keeps dictionary keys aligned and interpolates the selected language', () => {
		expect(Object.keys(dictionary('de')).sort()).toEqual(Object.keys(dictionary('en')).sort());
		expect(t('en', 'blog.readingTime', { minutes: 5 })).toBe('5 min read');
		expect(t('de', 'blog.readingTime', { minutes: 5 })).toBe('5 Min. Lesezeit');
	});
});
