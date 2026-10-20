<script lang="ts">
	import '#lib/styles/app.css';
	import favicon from '#lib/assets/favicon.svg';
	import LocaleProvider from '#lib/i18n/LocaleProvider.svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	$effect(() => {
		document.documentElement.lang = data.locale;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<LocaleProvider locale={data.locale}>{@render children()}</LocaleProvider>
