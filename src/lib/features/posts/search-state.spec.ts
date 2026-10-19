import { describe, expect, it } from 'vitest';
import { parseSearchState, serializeSearchState } from './search-state';

describe('search URL state', () => {
	it('round-trips valid filters and sorting through the URL', () => {
		const state = { q: 'svelte', tag: 'engineering', sort: 'oldest' } as const;
		expect(parseSearchState(serializeSearchState(state))).toEqual(state);
	});

	it('normalizes whitespace and drops unsupported values', () => {
		const params = new URLSearchParams('q=%20%20hello%20%20&tag=%20design%20&sort=unknown&extra=1');
		expect(parseSearchState(params)).toEqual({
			q: 'hello',
			tag: 'design',
			sort: 'newest'
		});
	});

	it('keeps default values out of shareable URLs', () => {
		expect(serializeSearchState({ q: '', tag: '', sort: 'newest' }).toString()).toBe('');
	});

	it('rejects oversized query values at the URL boundary', () => {
		const params = new URLSearchParams({ q: 'a'.repeat(101), tag: 'x'.repeat(51) });
		expect(parseSearchState(params)).toEqual({ q: '', tag: '', sort: 'newest' });
	});
});
