import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';
import { mapPostArticle } from '#lib/features/posts/mappers/post.js';
import { isLocale, locales } from '#lib/i18n/index.js';
import { getPost, listPosts, listTags } from '#lib/server/data/posts.js';

export const prerender = true;
export const entries: EntryGenerator = () =>
	locales.flatMap((locale) => listPosts().map(({ slug }) => ({ locale, slug })));

export const load: PageServerLoad = ({ params }) => {
	if (!isLocale(params.locale)) error(404);
	const post = getPost(params.slug);
	if (!post) error(404);
	return { post: mapPostArticle(post, params.locale), tags: listTags() };
};
