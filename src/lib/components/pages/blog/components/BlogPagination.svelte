<script lang="ts">
	import { useLocale } from '#lib/i18n/context.js';
	import { t } from '#lib/i18n/index.js';
	import { blogPagePostsHref } from '#lib/i18n/hrefs.js';

	let { page, pageCount }: { page: number; pageCount: number } = $props();

	const currentLocale = useLocale();
	let locale = $derived(currentLocale());

	let pages = $derived(Array.from({ length: pageCount }, (_, index) => index + 1));
</script>

{#if pageCount > 1}
	<nav
		aria-label={t(locale, 'blog.pagination.label')}
		class="mt-12 flex flex-wrap items-center justify-center gap-2"
	>
		{#if page > 1}
			<a
				href={blogPagePostsHref(locale, page - 1)}
				rel="prev"
				class="rounded-control border border-border px-4 py-2 text-caption font-semibold text-foreground transition-colors hover:border-accent/70"
			>
				← {t(locale, 'blog.pagination.previous')}
			</a>
		{/if}
		{#each pages as number (number)}
			<a
				href={blogPagePostsHref(locale, number)}
				aria-label={t(locale, 'blog.pagination.page', { page: number })}
				aria-current={number === page ? 'page' : undefined}
				class={`min-w-10 rounded-control border px-3 py-2 text-center text-caption font-bold transition-colors ${number === page ? 'border-accent bg-accent-soft text-accent' : 'border-border text-muted hover:border-accent/70 hover:text-foreground'}`}
			>
				{number}
			</a>
		{/each}
		{#if page < pageCount}
			<a
				href={blogPagePostsHref(locale, page + 1)}
				rel="next"
				class="rounded-control border border-border px-4 py-2 text-caption font-semibold text-foreground transition-colors hover:border-accent/70"
			>
				{t(locale, 'blog.pagination.next')} →
			</a>
		{/if}
	</nav>
{/if}
