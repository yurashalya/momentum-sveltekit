<script lang="ts">
	import '#lib/styles/app.css';
	import favicon from '#lib/assets/favicon.svg';
	import LocaleProvider from '#lib/i18n/LocaleProvider.svelte';
	import ErrorPage from '#lib/components/pages/error/ErrorPage.svelte';
	import { reportClientError } from '#lib/telemetry/client.js';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	$effect(() => {
		document.documentElement.lang = data.locale;
	});
	$effect(() => {
		void import('#lib/telemetry/client.js').then(({ initTelemetry }) => initTelemetry());
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<LocaleProvider locale={data.locale}>
	<svelte:boundary onerror={(error) => reportClientError(error, 'boundary')}>
		{@render children()}
		{#snippet failed()}
			<ErrorPage status={500} />
		{/snippet}
	</svelte:boundary>
</LocaleProvider>
