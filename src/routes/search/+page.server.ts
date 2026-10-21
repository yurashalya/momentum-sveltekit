import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { serializeSearchState } from '#lib/features/posts/search-state.js';
import { LOCALE } from '#lib/i18n/index.js';
import { getPostSearchResults } from '#lib/server/data/posts.js';

export const prerender = false;

export const load: PageServerLoad = ({ url }) => {
	const data = getPostSearchResults(url.searchParams, LOCALE.EN);
	const normalized = serializeSearchState(data.state).toString();
	if (url.searchParams.toString() !== normalized) {
		redirect(307, `${url.pathname}${normalized ? `?${normalized}` : ''}`);
	}
	return data;
};
