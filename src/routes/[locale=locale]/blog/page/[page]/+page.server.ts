import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';
import { getPostPage, listPostPageNumbers, listTags } from '#lib/server/data/posts.js';
import { isLocale, locales } from '#lib/i18n/index.js';

export const prerender = true;
export const entries: EntryGenerator = () =>
	locales.flatMap((locale) =>
		listPostPageNumbers()
			.slice(1)
			.map((page) => ({ locale, page: String(page) }))
	);

export const load: PageServerLoad = ({ params }) => {
	if (!isLocale(params.locale)) error(404);
	const page = Number(params.page);
	if (!Number.isSafeInteger(page) || page < 2 || String(page) !== params.page) error(404);
	const result = getPostPage(params.locale, page);
	if (!result) error(404);
	return { ...result, tags: listTags() };
};
