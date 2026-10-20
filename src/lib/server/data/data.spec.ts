import { describe, expect, it } from 'vitest';
import rawCampaigns from '../../../../mocks/items.json';
import rawPosts from '../../../../mocks/posts.json';
import rawTags from '../../../../mocks/tags.json';
import rawUsers from '../../../../mocks/users.json';
import { loginSchema, userSchema, usersSchema } from '#lib/features/auth/schema.js';
import { campaignSchema, campaignsSchema } from '#lib/features/campaigns/schema.js';
import { postSchema, postsSchema, tagsSchema } from '#lib/features/posts/schema.js';
import { summarizePost } from '#lib/features/posts/mappers/post.js';
import { parseSearchState } from '#lib/features/posts/search-state.js';
import { LOCALE } from '#lib/i18n/index.js';
import { parseCampaignListParams, getCampaignPage, renameCampaign } from './campaigns.js';
import {
	getPost,
	getPostPage,
	listPostPageNumbers,
	listPosts,
	listTags,
	searchPosts
} from './posts.js';
import { authenticate, getUser } from './users.js';

describe('mock data boundary', () => {
	it('validates all supplied records before they enter the data layer', () => {
		expect(postsSchema.parse(rawPosts)).toHaveLength(20);
		expect(campaignsSchema.parse(rawCampaigns)).toHaveLength(220);
		expect(usersSchema.parse(rawUsers)).toHaveLength(3);
		expect(tagsSchema.parse(rawTags)).toHaveLength(8);
		expect(listPosts()).toHaveLength(20);
		expect(listTags()).toHaveLength(8);
	});

	it('rejects invalid source records', () => {
		expect(campaignSchema.safeParse({ ...rawCampaigns[0], budget: -1 }).success).toBe(false);
		expect(
			postSchema.safeParse({ ...rawPosts[0], translations: { en: rawPosts[0].translations.en } })
				.success
		).toBe(false);
		expect(userSchema.safeParse({ ...rawUsers[0], role: 'owner' }).success).toBe(false);
	});
});

describe('server-side campaign queries', () => {
	it('paginates the complete source without repeating rows', () => {
		const first = getCampaignPage(parseCampaignListParams(new URLSearchParams('page=1')));
		const second = getCampaignPage(parseCampaignListParams(new URLSearchParams('page=2')));
		expect(first).toMatchObject({ total: 220, page: 1, pageCount: 11, pageSize: 20 });
		expect(first.rows).toHaveLength(20);
		expect(second.rows).toHaveLength(20);
		expect(new Set([...first.rows, ...second.rows].map((row) => row.id)).size).toBe(40);
		expect(getCampaignPage(parseCampaignListParams(new URLSearchParams('page=999'))).page).toBe(11);
	});

	it('combines facets and sorts the filtered results on the server', () => {
		const status = rawCampaigns[0].status;
		const channel = rawCampaigns[0].channel;
		const result = getCampaignPage(
			parseCampaignListParams(new URLSearchParams({ status, channel, sort: 'budget', dir: 'asc' }))
		);
		const expectedCount = rawCampaigns.filter(
			(row) => row.status === status && row.channel === channel
		).length;
		expect(result.total).toBe(expectedCount);
		expect(result.rows.every((row) => row.status === status && row.channel === channel)).toBe(true);
		expect(result.rows.map((row) => row.budget)).toEqual(
			[...result.rows.map((row) => row.budget)].sort((a, b) => a - b)
		);
	});

	it('validates edits and exposes an accepted edit through the query API', () => {
		const original = rawCampaigns[0];
		expect(() => renameCampaign({ id: original.id, name: 'x' })).toThrow();
		expect(() => renameCampaign({ id: 'missing', name: 'Valid name' })).toThrow(
			'Campaign not found'
		);
		try {
			expect(renameCampaign({ id: original.id, name: 'Updated campaign' }).name).toBe(
				'Updated campaign'
			);
			expect(
				getCampaignPage(
					parseCampaignListParams(new URLSearchParams('q=Updated campaign'))
				).rows.some((row) => row.id === original.id)
			).toBe(true);
		} finally {
			renameCampaign({ id: original.id, name: original.name });
		}
	});
});

describe('blog pagination', () => {
	it('covers all 20 posts once, in newest-first order, across four pages', () => {
		expect(listPostPageNumbers()).toEqual([1, 2, 3, 4]);
		const pages = listPostPageNumbers().map((page) => getPostPage(LOCALE.EN, page)!);
		expect(pages.map(({ posts }) => posts.length)).toEqual([6, 6, 6, 2]);
		expect(pages[0]).toMatchObject({ page: 1, pageCount: 4, total: 20 });
		expect(pages.flatMap(({ posts }) => posts.map(({ slug }) => slug))).toEqual(
			[...rawPosts]
				.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
				.map(({ slug }) => slug)
		);
	});

	it('localizes summaries and rejects invalid page numbers', () => {
		const english = getPostPage(LOCALE.EN, 2)!;
		const german = getPostPage(LOCALE.DE, 2)!;
		expect(german.posts.map(({ slug }) => slug)).toEqual(english.posts.map(({ slug }) => slug));
		expect(german.posts[0].title).toBe(
			getPost(german.posts[0].slug)?.translations[LOCALE.DE].title
		);
		expect(german.posts[0].title).not.toBe(english.posts[0].title);
		expect(getPostPage(LOCALE.EN, 0)).toBeUndefined();
		expect(getPostPage(LOCALE.EN, 5)).toBeUndefined();
		expect(getPostPage(LOCALE.EN, 1.5)).toBeUndefined();
	});
});

describe('posts and authentication', () => {
	it('searches localized text and applies the tag and date order', () => {
		const localized = searchPosts(parseSearchState(new URLSearchParams('q=Sekunde')), LOCALE.DE);
		expect(localized.map((post) => post.slug)).toContain(rawPosts[0].slug);
		expect(
			searchPosts(parseSearchState(new URLSearchParams('q=Sekunde')), LOCALE.EN).map(
				(post) => post.slug
			)
		).not.toContain(rawPosts[0].slug);
		const filtered = searchPosts(
			parseSearchState(new URLSearchParams('tag=engineering&sort=oldest')),
			LOCALE.EN
		);
		expect(filtered.length).toBeGreaterThan(0);
		expect(filtered.every((post) => post.tags.includes('engineering'))).toBe(true);
		expect(filtered.map((post) => post.publishedAt)).toEqual(
			[...filtered.map((post) => post.publishedAt)].sort()
		);
		expect(getPost(rawPosts[0].slug)?.id).toBe(rawPosts[0].id);
		expect(summarizePost(listPosts()[0], LOCALE.DE)).toMatchObject({
			slug: rawPosts[0].slug,
			title: rawPosts[0].translations[LOCALE.DE].title
		});
	});

	it('normalizes login input and never returns demo passwords', () => {
		const input = loginSchema.parse({ email: '  EDITOR@DEMO.TEST  ', password: 'demo1234' });
		expect(input.email).toBe('editor@demo.test');
		const user = authenticate(input.email, input.password);
		expect(user?.role).toBe('editor');
		expect(user).not.toHaveProperty('password');
		expect(getUser(user!.id)).not.toHaveProperty('password');
		expect(authenticate(input.email, 'incorrect')).toBeUndefined();
	});
});
