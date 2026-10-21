<script lang="ts">
	import { resolve } from '$app/paths';
	import PublicFooter from '#lib/components/layout/PublicFooter.svelte';
	import PublicHeader from '#lib/components/layout/PublicHeader.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Container from '#lib/components/ui/Container.svelte';
	import Heading from '#lib/components/ui/Heading.svelte';
	import type { PostArticle } from '#lib/features/posts/mappers/post.js';
	import type { Tag } from '#lib/features/posts/schema.js';
	import { useLocale } from '#lib/i18n/context.js';
	import { defaultLocale, formatDate, LOCALE, t } from '#lib/i18n/index.js';
	import { blogHref, postHref } from '#lib/i18n/hrefs.js';
	import { localeHomePath } from '#lib/i18n/paths.js';
	import { absoluteUrl, postImageUrl } from '#lib/seo/site.js';

	let { post, tags }: { post: PostArticle; tags: Tag[] } = $props();

	const currentLocale = useLocale();
	let locale = $derived(currentLocale());

	let canonical = $derived(absoluteUrl(postHref(locale, post.slug)));
	let image = $derived(postImageUrl(locale, post.slug));
	let title = $derived(`${post.title} — Momentum`);

	let paragraphs = $derived(post.body.split(/\n\s*\n/).filter(Boolean));

	let jsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'Article',
					headline: post.title,
					description: post.excerpt,
					image,
					datePublished: post.publishedAt,
					author: { '@type': 'Person', name: post.author.name },
					mainEntityOfPage: canonical
				},
				{
					'@type': 'BreadcrumbList',
					itemListElement: [
						{
							'@type': 'ListItem',
							position: 1,
							name: t(locale, 'nav.home'),
							item: absoluteUrl(resolve(localeHomePath(locale)))
						},
						{
							'@type': 'ListItem',
							position: 2,
							name: t(locale, 'nav.blog'),
							item: absoluteUrl(blogHref(locale))
						},
						{ '@type': 'ListItem', position: 3, name: post.title, item: canonical }
					]
				}
			]
		}).replaceAll('<', '\\u003c')
	);
	// '<' is escaped before this markup is inserted into the JSON-LD script.
	let jsonLdScript = $derived(`<script type="application/ld+json">${jsonLd}</` + 'script>');
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={post.excerpt} />
	<link rel="canonical" href={canonical} />
	<link rel="alternate" hreflang={LOCALE.EN} href={absoluteUrl(postHref(LOCALE.EN, post.slug))} />
	<link rel="alternate" hreflang={LOCALE.DE} href={absoluteUrl(postHref(LOCALE.DE, post.slug))} />
	<link
		rel="alternate"
		hreflang="x-default"
		href={absoluteUrl(postHref(defaultLocale, post.slug))}
	/>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={post.excerpt} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="article:published_time" content={post.publishedAt} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={post.excerpt} />
	<meta name="twitter:image" content={image} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLdScript}
</svelte:head>

<div id="top" class="min-h-screen bg-canvas text-foreground">
	<PublicHeader />
	<main id="main">
		<article>
			<header class="border-b border-border/60 py-section">
				<Container>
					<nav
						aria-label={t(locale, 'blog.article.breadcrumb')}
						class="mb-9 flex flex-wrap items-center gap-2 text-caption text-muted"
					>
						<a href={resolve(localeHomePath(locale))} class="hover:text-foreground"
							>{t(locale, 'nav.home')}</a
						>
						<span aria-hidden="true">/</span>
						<a href={blogHref(locale)} class="hover:text-foreground">{t(locale, 'nav.blog')}</a>
						<span aria-hidden="true">/</span>
						<span aria-current="page" class="text-foreground">{post.title}</span>
					</nav>
					<div class="flex flex-wrap gap-2">
						{#each post.tags as slug (slug)}
							{@const tag = tags.find((item) => item.slug === slug)}
							<Badge variant="accent">{tag?.label[locale] ?? slug}</Badge>
						{/each}
					</div>
					<Heading level={1} class="mt-6 max-w-4xl">{post.title}</Heading>
					<p class="mt-6 max-w-3xl text-lg leading-relaxed text-muted">{post.excerpt}</p>
					<div class="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-caption text-muted">
						<span class="font-semibold text-foreground"
							>{t(locale, 'blog.article.by', { author: post.author.name })}</span
						>
						<span aria-hidden="true">·</span>
						<time datetime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
						<span aria-hidden="true">·</span>
						<span>{t(locale, 'blog.readingTime', { minutes: post.readingTimeMinutes })}</span>
					</div>
				</Container>
			</header>
			<Container class="py-section">
				<div
					class="mb-12 h-48 overflow-hidden rounded-card sm:h-64"
					style:background-color={post.coverColor}
					aria-hidden="true"
				>
					<div
						class="h-full w-full bg-gradient-to-br from-white/10 via-transparent to-black/40"
					></div>
				</div>
				<div class="max-w-3xl space-y-6 text-body leading-relaxed text-foreground/90">
					{#each paragraphs as paragraph, index (index)}
						<p>{paragraph}</p>
					{/each}
				</div>
				<a
					href={blogHref(locale)}
					class="mt-12 inline-flex items-center gap-2 text-caption font-bold text-accent hover:text-accent-hover"
					>← {t(locale, 'blog.article.back')}</a
				>
			</Container>
		</article>
	</main>
	<PublicFooter />
</div>
