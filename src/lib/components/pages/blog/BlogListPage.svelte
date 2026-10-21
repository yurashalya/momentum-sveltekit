<script lang="ts">
	import PublicFooter from '#lib/components/layout/PublicFooter.svelte';
	import PublicHeader from '#lib/components/layout/PublicHeader.svelte';
	import Container from '#lib/components/ui/Container.svelte';
	import Heading from '#lib/components/ui/Heading.svelte';
	import type { PostSummary } from '#lib/features/posts/mappers/post.js';
	import type { Tag } from '#lib/features/posts/schema.js';
	import { useLocale } from '#lib/i18n/context.js';
	import { defaultLocale, formatNumber, LOCALE, t } from '#lib/i18n/index.js';
	import { blogPageHref } from '#lib/i18n/hrefs.js';
	import { absoluteUrl } from '#lib/seo/site.js';
	import PostCard from '#lib/components/posts/PostCard.svelte';
	import BlogPagination from './components/BlogPagination.svelte';

	let {
		posts,
		tags,
		page,
		pageCount,
		total
	}: {
		posts: PostSummary[];
		tags: Tag[];
		page: number;
		pageCount: number;
		total: number;
	} = $props();
	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
	let canonical = $derived(absoluteUrl(blogPageHref(locale, page)));
	let title = $derived(
		page === 1 ? t(locale, 'blog.seo.title') : t(locale, 'blog.pagination.pageTitle', { page })
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={t(locale, 'blog.seo.description')} />
	<link rel="canonical" href={canonical} />
	<link rel="alternate" hreflang={LOCALE.EN} href={absoluteUrl(blogPageHref(LOCALE.EN, page))} />
	<link rel="alternate" hreflang={LOCALE.DE} href={absoluteUrl(blogPageHref(LOCALE.DE, page))} />
	<link
		rel="alternate"
		hreflang="x-default"
		href={absoluteUrl(blogPageHref(defaultLocale, page))}
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={t(locale, 'blog.seo.description')} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={absoluteUrl('/og/momentum.png')} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={t(locale, 'blog.seo.description')} />
	<meta name="twitter:image" content={absoluteUrl('/og/momentum.png')} />
</svelte:head>

<div id="top" class="min-h-screen bg-canvas text-foreground">
	<PublicHeader />
	<main id="main">
		<section class="border-b border-border/60 py-section">
			<Container>
				<p class="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-accent">
					{t(locale, 'blog.eyebrow')}
				</p>
				<Heading level={1}>{t(locale, 'blog.title')}</Heading>
				<p class="mt-5 max-w-2xl text-lg text-muted">{t(locale, 'blog.intro')}</p>
				<p class="mt-7 text-caption font-semibold text-accent">
					{t(locale, 'blog.count', { count: formatNumber(total, locale) })}
				</p>
			</Container>
		</section>
		<section id="blog-posts" class="py-section" aria-label={t(locale, 'blog.title')}>
			<Container>
				{#if posts.length === 0}
					<p class="text-muted">{t(locale, 'blog.empty')}</p>
				{:else}
					<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{#each posts as post (post.slug)}
							<PostCard {post} {tags} />
						{/each}
					</div>
					<BlogPagination {page} {pageCount} />
				{/if}
			</Container>
		</section>
	</main>
	<PublicFooter />
</div>
