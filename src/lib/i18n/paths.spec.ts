import { describe, expect, it } from 'vitest';
import { LOCALE } from './index.js';
import { localeFromPath } from './paths.js';

describe('locale routes', () => {
	it('selects a locale by a complete path segment', () => {
		expect(localeFromPath('/')).toBe(LOCALE.EN);
		expect(localeFromPath('/de')).toBe(LOCALE.DE);
		expect(localeFromPath('/de/blog')).toBe(LOCALE.DE);
		expect(localeFromPath('/design')).toBe(LOCALE.EN);
	});
});
