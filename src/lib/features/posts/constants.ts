import site from '../../../../site.config.json';

export const BLOG_PAGE_SIZE = site.blogPageSize;

export const POST_SORT = {
	NEWEST: 'newest',
	OLDEST: 'oldest',
	TITLE: 'title'
} as const;
