<script lang="ts">
	import Badge from '#lib/components/ui/Badge.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import Heading from '#lib/components/ui/Heading.svelte';
	import type { PostSummary } from '#lib/features/posts/mappers/post.js';
	import type { Tag } from '#lib/features/posts/schema.js';
	import { useLocale } from '#lib/i18n/context.js';
	import { formatDate, t } from '#lib/i18n/index.js';
	import { postHref as getPostHref } from '#lib/i18n/hrefs.js';

	let { post, tags }: { post: PostSummary; tags: Tag[] } = $props();

	const currentLocale = useLocale();

	let locale = $derived(currentLocale());
	let postHref = $derived(getPostHref(locale, post.slug));
</script>

<article class="h-full">
	<Card
		padding="none"
		class="flex h-full flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1"
	>
		<div
			class="relative h-44 overflow-hidden"
			style:background-color={post.coverColor}
			aria-hidden="true"
		>
			<div class="absolute -right-10 -top-20 h-56 w-56 rounded-full border border-white/20"></div>
			<div
				class="absolute -bottom-20 left-8 h-48 w-48 rotate-45 rounded-card border border-white/20"
			></div>
			<div
				class="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-black/50"
			></div>
		</div>
		<div class="flex flex-1 flex-col p-card">
			<div class="flex flex-wrap gap-2">
				{#each post.tags as slug (slug)}
					{@const tag = tags.find((item) => item.slug === slug)}
					<Badge variant="accent">{tag?.label[locale] ?? slug}</Badge>
				{/each}
			</div>
			<Heading level={2} class="mt-5 text-subheading">
				<a href={postHref} class="transition-colors hover:text-accent">{post.title}</a>
			</Heading>
			<p class="mt-3 flex-1 text-caption leading-relaxed text-muted">{post.excerpt}</p>
			<div
				class="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border/60 pt-4 text-xs text-muted"
			>
				<time datetime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
				<span aria-hidden="true">·</span>
				<span>{t(locale, 'blog.readingTime', { minutes: post.readingTimeMinutes })}</span>
			</div>
			<a
				href={postHref}
				class="mt-5 inline-flex w-fit items-center gap-2 text-caption font-bold text-accent hover:text-accent-hover"
				aria-label={`${t(locale, 'blog.readMore')}: ${post.title}`}
			>
				{t(locale, 'blog.readMore')} <span aria-hidden="true">↗</span>
			</a>
		</div>
	</Card>
</article>
