import rawPosts from '../../../../mocks/posts.json';
import rawTags from '../../../../mocks/tags.json';
import { BLOG_PAGE_SIZE, POST_SORT } from '#lib/features/posts/constants.js';
import { summarizePost } from '#lib/features/posts/mappers/post.js';
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

export const listPostPageNumbers = (): number[] => {
	return Array.from({ length: Math.ceil(posts.length / BLOG_PAGE_SIZE) }, (_, index) => index + 1);
};

export const getPostPage = (locale: Locale, page: number) => {
	const pageCount = Math.ceil(posts.length / BLOG_PAGE_SIZE);
	if (!Number.isSafeInteger(page) || page < 1 || page > pageCount) return undefined;

	return {
		posts: posts
			.slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE)
			.map((post) => summarizePost(post, locale)),
		page,
		pageCount,
		total: posts.length
	};
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
