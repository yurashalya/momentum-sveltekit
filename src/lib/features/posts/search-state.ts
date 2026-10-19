import { z } from 'zod';
import { POST_SORT } from './constants.js';

export const searchStateSchema = z.object({
	q: z.string().trim().max(100).catch(''),
	tag: z.string().trim().max(50).catch(''),
	sort: z.enum(POST_SORT).catch(POST_SORT.NEWEST)
});

export type SearchState = z.infer<typeof searchStateSchema>;

export const parseSearchState = (params: URLSearchParams): SearchState => {
	return searchStateSchema.parse({
		q: params.get('q') ?? '',
		tag: params.get('tag') ?? '',
		sort: params.get('sort') ?? POST_SORT.NEWEST
	});
};

export const serializeSearchState = (state: SearchState): URLSearchParams => {
	const normalized = searchStateSchema.parse(state);
	const params = new URLSearchParams();

	if (normalized.q) params.set('q', normalized.q);
	if (normalized.tag) params.set('tag', normalized.tag);
	if (normalized.sort !== POST_SORT.NEWEST) params.set('sort', normalized.sort);

	return params;
};
