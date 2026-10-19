import { z } from 'zod';

export const searchStateSchema = z.object({
	q: z.string().trim().max(100).catch(''),
	tag: z.string().trim().max(50).catch(''),
	sort: z.enum(['newest', 'oldest', 'title']).catch('newest')
});

export type SearchState = z.infer<typeof searchStateSchema>;

export function parseSearchState(params: URLSearchParams): SearchState {
	return searchStateSchema.parse({
		q: params.get('q') ?? '',
		tag: params.get('tag') ?? '',
		sort: params.get('sort') ?? 'newest'
	});
}

export function serializeSearchState(state: SearchState): URLSearchParams {
	const normalized = searchStateSchema.parse(state);
	const params = new URLSearchParams();

	if (normalized.q) params.set('q', normalized.q);
	if (normalized.tag) params.set('tag', normalized.tag);
	if (normalized.sort !== 'newest') params.set('sort', normalized.sort);

	return params;
}
