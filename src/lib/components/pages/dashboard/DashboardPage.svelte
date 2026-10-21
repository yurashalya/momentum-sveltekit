<script lang="ts">
	import Badge from '#lib/components/ui/Badge.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import Container from '#lib/components/ui/Container.svelte';
	import Heading from '#lib/components/ui/Heading.svelte';
	import type { PublicUser } from '#lib/features/auth/schema.js';
	import type { CampaignOverview } from '#lib/features/campaigns/schema.js';
	import { useLocale } from '#lib/i18n/context.js';
	import { formatCurrency, formatDate, formatNumber, t } from '#lib/i18n/index.js';
	import { dashboardItemsHref } from '#lib/i18n/hrefs.js';
	import { campaignStatusLabelKeys, campaignStatusVariants } from './constants.js';

	let { user, overview }: { user: PublicUser; overview: CampaignOverview } = $props();
	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
	let statistics = $derived([
		{ label: t(locale, 'dashboard.overview.total'), value: formatNumber(overview.total, locale) },
		{ label: t(locale, 'dashboard.overview.active'), value: formatNumber(overview.active, locale) },
		{
			label: t(locale, 'dashboard.overview.scheduled'),
			value: formatNumber(overview.scheduled, locale)
		},
		{
			label: t(locale, 'dashboard.overview.budget'),
			value: formatCurrency(overview.budget, locale)
		}
	]);
</script>

<svelte:head>
	<title>{t(locale, 'dashboard.title')} — Momentum</title>
	<meta name="robots" content="noindex,nofollow" />
</svelte:head>

<main id="main" class="flex-1 py-section">
	<Container>
		<p class="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-accent">
			{t(locale, 'dashboard.eyebrow')}
		</p>
		<Heading level={1}>{t(locale, 'dashboard.title')}</Heading>
		<p class="mt-5 max-w-2xl text-lg text-muted">
			{t(locale, 'dashboard.welcome', { name: user.name })}
		</p>
		<div class="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{#each statistics as statistic (statistic.label)}
				<Card variant="muted" class="min-h-32">
					<p class="text-caption text-muted">{statistic.label}</p>
					<p class="mt-5 text-subheading font-bold tracking-tight">{statistic.value}</p>
				</Card>
			{/each}
		</div>
		<section class="mt-12" aria-labelledby="recent-campaigns-title">
			<div class="mb-6 flex flex-wrap items-end justify-between gap-4">
				<div>
					<h2 id="recent-campaigns-title" class="text-subheading font-bold tracking-tight">
						{t(locale, 'dashboard.overview.recentTitle')}
					</h2>
					<p class="mt-2 text-caption text-muted">{t(locale, 'dashboard.overview.recentHint')}</p>
				</div>
				<a
					href={dashboardItemsHref(locale)}
					class="rounded-control border border-border-strong px-4 py-2 text-caption font-bold text-foreground transition-colors hover:border-accent hover:bg-surface-raised"
					>{t(locale, 'dashboard.overview.viewAll')} →</a
				>
			</div>
			<Card padding="none" class="overflow-hidden">
				<ul class="divide-y divide-border/60">
					{#each overview.recent as campaign (campaign.id)}
						<li class="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
							<div>
								<p class="font-semibold">{campaign.name}</p>
								<p class="mt-1 text-caption text-muted">
									{campaign.owner.name} · {formatDate(campaign.updatedAt, locale)}
								</p>
							</div>
							<Badge variant={campaignStatusVariants[campaign.status]}
								>{t(locale, campaignStatusLabelKeys[campaign.status])}</Badge
							>
						</li>
					{/each}
				</ul>
			</Card>
		</section>
	</Container>
</main>
