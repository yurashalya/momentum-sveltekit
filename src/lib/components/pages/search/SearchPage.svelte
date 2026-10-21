<script lang="ts">
	import PublicFooter from '#lib/components/layout/PublicFooter.svelte';
	import PublicHeader from '#lib/components/layout/PublicHeader.svelte';
	import PostCard from '#lib/components/posts/PostCard.svelte';
	import Container from '#lib/components/ui/Container.svelte';
	import Heading from '#lib/components/ui/Heading.svelte';
	import { POST_SORT } from '#lib/features/posts/constants.js';
	import type { PostSummary } from '#lib/features/posts/mappers/post.js';
	import type { Tag } from '#lib/features/posts/schema.js';
	import type { SearchState } from '#lib/features/posts/search-state.js';
	import { useLocale } from '#lib/i18n/context.js';
	import { defaultLocale, formatNumber, LOCALE, t } from '#lib/i18n/index.js';
	import { searchHref } from '#lib/i18n/hrefs.js';
	import SearchFilters from './components/SearchFilters.svelte';

	let {
		state,
		posts,
		total,
		tags
	}: {
		state: SearchState;
		posts: PostSummary[];
		total: number;
		tags: Tag[];
	} = $props();
	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
	let title = $derived(t(locale, 'search.seo.title'));
	let description = $derived(t(locale, 'search.seo.description'));
	let canonical = $derived(searchHref(locale));
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="robots" content="noindex,follow" />
	<link rel="canonical" href={canonical} />
	<link rel="alternate" hreflang={LOCALE.EN} href={searchHref(LOCALE.EN)} />
	<link rel="alternate" hreflang={LOCALE.DE} href={searchHref(LOCALE.DE)} />
	<link rel="alternate" hreflang="x-default" href={searchHref(defaultLocale)} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
</svelte:head>

<div id="top" class="min-h-screen bg-canvas text-foreground">
	<PublicHeader />
	<main id="main">
		<section class="border-b border-border/60 py-section">
			<Container>
				<p class="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-accent">
					{t(locale, 'search.eyebrow')}
				</p>
				<Heading level={1}>{t(locale, 'search.title')}</Heading>
				<p class="mb-9 mt-5 max-w-2xl text-lg text-muted">{t(locale, 'search.intro')}</p>
				<SearchFilters {state} {tags} />
			</Container>
		</section>
		<section class="py-section" aria-label={t(locale, 'search.title')}>
			<Container>
				<p role="status" class="mb-8 text-caption font-semibold text-accent">
					{#if state.q}
						{t(locale, 'search.results', { count: formatNumber(total, locale), query: state.q })}
					{:else if state.tag || state.sort !== POST_SORT.NEWEST}
						{t(locale, 'search.resultCount', { count: formatNumber(total, locale) })}
					{:else}
						{t(locale, 'search.allResults', { count: formatNumber(total, locale) })}
					{/if}
				</p>
				{#if posts.length > 0}
					<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{#each posts as post (post.slug)}
							<PostCard {post} {tags} />
						{/each}
					</div>
				{:else}
					<div class="rounded-card border border-border bg-surface p-card">
						<Heading level={2} class="text-subheading">{t(locale, 'search.emptyTitle')}</Heading>
						<p class="mt-3 text-caption text-muted">{t(locale, 'search.emptyHint')}</p>
						<a
							href={searchHref(locale)}
							class="mt-5 inline-block text-caption font-bold text-accent hover:text-accent-hover"
						>
							{t(locale, 'search.clear')}
						</a>
					</div>
				{/if}
			</Container>
		</section>
	</main>
	<PublicFooter />
</div>
