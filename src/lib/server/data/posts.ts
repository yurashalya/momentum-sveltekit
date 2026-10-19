import rawPosts from '../../../../mocks/posts.json';
import rawTags from '../../../../mocks/tags.json';
import { POST_SORT } from '#lib/features/posts/constants.js';
import { postsSchema, tagsSchema } from '#lib/features/posts/schema.js';
import type { Post } from '#lib/features/posts/schema.js';
import type { SearchState } from '#lib/features/posts/search-state.js';
import type { Locale } from '#lib/i18n/index.js';

const posts = postsSchema
	.parse(rawPosts)
	.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
const tags = tagsSchema.parse(rawTags);

export const listPosts = (): Post[] => {
	return posts;
};

export const getPost = (slug: string): Post | undefined => {
	return posts.find((post) => post.slug === slug);
};

export const listTags = () => {
	return tags;
};

export const searchPosts = (state: SearchState, locale: Locale): Post[] => {
	const query = state.q.toLocaleLowerCase(locale);
	const matching = posts.filter((post) => {
		const translation = post.translations[locale];
		const content =
			`${translation.title} ${translation.excerpt} ${translation.body}`.toLocaleLowerCase(locale);
		return (!query || content.includes(query)) && (!state.tag || post.tags.includes(state.tag));
	});
	return matching.sort((a, b) => {
		if (state.sort === POST_SORT.TITLE) {
			return a.translations[locale].title.localeCompare(b.translations[locale].title, locale);
		}
		return state.sort === POST_SORT.OLDEST
			? a.publishedAt.localeCompare(b.publishedAt)
			: b.publishedAt.localeCompare(a.publishedAt);
	});
};
