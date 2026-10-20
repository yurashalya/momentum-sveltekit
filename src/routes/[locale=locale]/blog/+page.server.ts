import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';
import { getPostPage, listTags } from '#lib/server/data/posts.js';
import { isLocale, locales } from '#lib/i18n/index.js';

export const prerender = true;
export const entries: EntryGenerator = () => locales.map((locale) => ({ locale }));

export const load: PageServerLoad = ({ params }) => {
	if (!isLocale(params.locale)) error(404);
	const result = getPostPage(params.locale, 1);
	if (!result) error(404);
	return { ...result, tags: listTags() };
};
