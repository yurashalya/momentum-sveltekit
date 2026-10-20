import type { Post } from '#lib/features/posts/schema.js';
import type { Locale } from '#lib/i18n/index.js';

export const summarizePost = (post: Post, locale: Locale) => {
	return {
		slug: post.slug,
		title: post.translations[locale].title,
		excerpt: post.translations[locale].excerpt,
		tags: post.tags,
		publishedAt: post.publishedAt,
		readingTimeMinutes: post.readingTimeMinutes,
		coverColor: post.coverColor
	};
};

export type PostSummary = ReturnType<typeof summarizePost>;

export const mapPostArticle = (post: Post, locale: Locale) => ({
	...summarizePost(post, locale),
	body: post.translations[locale].body,
	author: post.author
});

export type PostArticle = ReturnType<typeof mapPostArticle>;
