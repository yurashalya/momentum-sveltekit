<script lang="ts">
	import Card from '#lib/components/ui/Card.svelte';
	import Container from '#lib/components/ui/Container.svelte';
	import Heading from '#lib/components/ui/Heading.svelte';
	import type { PublicUser } from '#lib/features/auth/schema.js';
	import { serializeCampaignListParams } from '#lib/features/campaigns/list-state.js';
	import type { CampaignListParams, CampaignPage } from '#lib/features/campaigns/schema.js';
	import { useLocale } from '#lib/i18n/context.js';
	import { t } from '#lib/i18n/index.js';
	import { dashboardHref, dashboardItemsHref } from '#lib/i18n/hrefs.js';
	import CampaignFilters from './components/CampaignFilters.svelte';
	import CampaignTable from './components/CampaignTable.svelte';

	let {
		state,
		result,
		user
	}: { state: CampaignListParams; result: Promise<CampaignPage>; user: PublicUser } = $props();
	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
</script>

<svelte:head>
	<title>{t(locale, 'dashboard.items.title')} — Momentum</title>
	<meta name="robots" content="noindex,nofollow" />
</svelte:head>

<main id="main" class="flex-1 py-section">
	<Container>
		<nav
			aria-label={t(locale, 'dashboard.items.breadcrumb')}
			class="mb-9 flex flex-wrap items-center gap-2 text-caption text-muted"
		>
			<a href={dashboardHref(locale)} class="hover:text-foreground"
				>{t(locale, 'dashboard.title')}</a
			>
			<span aria-hidden="true">/</span>
			<span aria-current="page" class="text-foreground">{t(locale, 'dashboard.items.title')}</span>
		</nav>
		<p class="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-accent">
			{t(locale, 'dashboard.eyebrow')}
		</p>
		<Heading level={1}>{t(locale, 'dashboard.items.title')}</Heading>
		<p class="mt-5 max-w-2xl text-lg text-muted">{t(locale, 'dashboard.items.intro')}</p>
		<div class="mt-10"><CampaignFilters filters={state} /></div>
		<section class="mt-10" aria-label={t(locale, 'dashboard.items.title')}>
			{#await result}
				<div role="status" aria-live="polite">
					<p class="mb-4 text-caption font-semibold text-muted">
						{t(locale, 'dashboard.items.loading')}
					</p>
					<Card padding="none" class="overflow-hidden">
						<div class="animate-pulse divide-y divide-border/60" aria-hidden="true">
							{#each [1, 2, 3, 4, 5] as row (row)}
								<div class="flex gap-8 px-5 py-5">
									<span class="h-5 w-1/3 rounded bg-surface-raised"></span><span
										class="h-5 w-1/5 rounded bg-surface-raised"
									></span><span class="h-5 w-1/4 rounded bg-surface-raised"></span>
								</div>
							{/each}
						</div>
					</Card>
				</div>
			{:then pageData}
				<CampaignTable {pageData} filters={state} canEdit={user.role !== 'viewer'} />
			{:catch}
				<div role="alert">
					<Card>
						<h2 class="text-subheading font-bold">{t(locale, 'dashboard.items.loadError')}</h2>
						<p class="mt-3 text-caption text-muted">{t(locale, 'common.error')}</p>
						<a
							href={dashboardItemsHref(locale, serializeCampaignListParams(state))}
							class="mt-5 inline-block rounded-control border border-border-strong px-4 py-2 text-caption font-bold hover:border-accent"
							>{t(locale, 'dashboard.items.retry')}</a
						>
					</Card>
				</div>
			{/await}
		</section>
	</Container>
</main>
