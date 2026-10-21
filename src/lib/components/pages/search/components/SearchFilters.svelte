<script lang="ts">
	import Button from '#lib/components/ui/Button.svelte';
	import Input from '#lib/components/ui/Input.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { POST_SORT } from '#lib/features/posts/constants.js';
	import type { Tag } from '#lib/features/posts/schema.js';
	import type { SearchState } from '#lib/features/posts/search-state.js';
	import { useLocale } from '#lib/i18n/context.js';
	import { t } from '#lib/i18n/index.js';
	import { searchHref } from '#lib/i18n/hrefs.js';

	let { state, tags }: { state: SearchState; tags: Tag[] } = $props();
	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
	let tagOptions = $derived([
		{ value: '', label: t(locale, 'search.allTags') },
		...tags.map((tag) => ({ value: tag.slug, label: tag.label[locale] }))
	]);
	let sortOptions = $derived([
		{ value: POST_SORT.NEWEST, label: t(locale, 'search.sortNewest') },
		{ value: POST_SORT.OLDEST, label: t(locale, 'search.sortOldest') },
		{ value: POST_SORT.TITLE, label: t(locale, 'search.sortTitle') }
	]);
</script>

<form
	method="GET"
	action={searchHref(locale)}
	role="search"
	aria-label={t(locale, 'search.formLabel')}
	class="rounded-card border border-border bg-surface p-card shadow-card"
>
	<div class="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
		<Input
			id="search-query"
			name="q"
			type="search"
			maxlength={100}
			label={t(locale, 'search.queryLabel')}
			placeholder={t(locale, 'search.placeholder')}
			value={state.q}
		/>
		<Select
			id="search-tag"
			name="tag"
			label={t(locale, 'search.tagLabel')}
			options={tagOptions}
			value={state.tag}
		/>
		<Select
			id="search-sort"
			name="sort"
			label={t(locale, 'search.sortLabel')}
			options={sortOptions}
			value={state.sort}
		/>
	</div>
	<div class="mt-5 flex flex-wrap items-center gap-4">
		<Button type="submit">{t(locale, 'search.submit')}</Button>
		{#if state.q || state.tag || state.sort !== POST_SORT.NEWEST}
			<a
				href={searchHref(locale)}
				class="text-caption font-semibold text-muted hover:text-foreground"
			>
				{t(locale, 'search.clear')}
			</a>
		{/if}
	</div>
</form>
