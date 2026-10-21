<script lang="ts">
	import { resolve } from '$app/paths';
	import { tick } from 'svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import Toast from '#lib/components/ui/Toast.svelte';
	import { CAMPAIGN_SORT, SORT_DIRECTION } from '#lib/features/campaigns/constants.js';
	import { serializeCampaignListParams } from '#lib/features/campaigns/list-state.js';
	import {
		campaignMutationErrorSchema,
		campaignMutationSuccessSchema,
		renameCampaignSchema,
		type Campaign,
		type CampaignListParams,
		type CampaignPage
	} from '#lib/features/campaigns/schema.js';
	import { useLocale } from '#lib/i18n/context.js';
	import { formatCurrency, formatDate, formatNumber, t } from '#lib/i18n/index.js';
	import { dashboardItemsHref } from '#lib/i18n/hrefs.js';
	import {
		campaignChannelLabelKeys,
		campaignStatusLabelKeys,
		campaignStatusVariants
	} from '../constants.js';

	let {
		pageData,
		filters,
		canEdit
	}: {
		pageData: CampaignPage;
		filters: CampaignListParams;
		canEdit: boolean;
	} = $props();
	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
	let optimisticNames = $state<Record<string, string>>({});
	let editingId = $state<string | null>(null);
	let draftName = $state('');
	let editingError = $state<string | null>(null);
	let pendingId = $state<string | null>(null);
	let notice = $state<{ variant: 'success' | 'error'; text: string } | null>(null);
	let firstRow = $derived(pageData.total ? (pageData.page - 1) * pageData.pageSize + 1 : 0);
	let lastRow = $derived(Math.min(pageData.page * pageData.pageSize, pageData.total));

	const displayName = (campaign: Campaign) => optimisticNames[campaign.id] ?? campaign.name;
	const formatCtr = (value: number) =>
		new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(value);
	const pageHref = (number: number) =>
		dashboardItemsHref(locale, serializeCampaignListParams({ ...filters, page: number }));
	const sortHref = (sort: CampaignListParams['sort']) =>
		dashboardItemsHref(
			locale,
			serializeCampaignListParams({
				...filters,
				sort,
				dir:
					filters.sort === sort && filters.dir === SORT_DIRECTION.ASC
						? SORT_DIRECTION.DESC
						: SORT_DIRECTION.ASC,
				page: 1
			})
		);
	const sortOrder = (sort: CampaignListParams['sort']) =>
		filters.sort === sort
			? filters.dir === SORT_DIRECTION.ASC
				? 'ascending'
				: 'descending'
			: undefined;

	const startEdit = async (campaign: Campaign) => {
		editingId = campaign.id;
		draftName = displayName(campaign);
		editingError = null;
		notice = null;
		await tick();
		document.getElementById(`campaign-name-${campaign.id}`)?.focus();
	};

	const cancelEdit = async (id: string) => {
		editingId = null;
		editingError = null;
		await tick();
		document.getElementById(`edit-campaign-${id}`)?.focus();
	};

	const rollback = (
		campaign: Campaign,
		previousName: string,
		errorKey:
			| 'dashboard.items.archivedError'
			| 'dashboard.items.forbiddenError'
			| 'dashboard.items.notFoundError'
			| 'dashboard.items.nameInvalid'
			| 'dashboard.items.networkError'
	) => {
		optimisticNames = { ...optimisticNames, [campaign.id]: previousName };
		notice = { variant: 'error', text: t(locale, errorKey) };
	};

	const submitRename = async (event: SubmitEvent, campaign: Campaign) => {
		event.preventDefault();
		if (pendingId) return;
		const parsed = renameCampaignSchema.safeParse({ id: campaign.id, name: draftName });
		if (!parsed.success) {
			editingError = t(locale, 'dashboard.items.nameInvalid');
			return;
		}
		const previousName = displayName(campaign);
		optimisticNames = { ...optimisticNames, [campaign.id]: parsed.data.name };
		editingId = null;
		editingError = null;
		pendingId = campaign.id;
		notice = null;

		try {
			const response = await fetch(resolve('/api/campaigns/[id]', { id: campaign.id }), {
				method: 'PATCH',
				credentials: 'same-origin',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ name: parsed.data.name })
			});
			const body: unknown = await response.json();
			if (response.ok) {
				const updated = campaignMutationSuccessSchema.safeParse(body);
				if (!updated.success) throw new Error('Invalid campaign update response');
				optimisticNames = { ...optimisticNames, [campaign.id]: updated.data.campaign.name };
				notice = { variant: 'success', text: t(locale, 'dashboard.items.updated') };
			} else {
				const failure = campaignMutationErrorSchema.safeParse(body);
				const key =
					failure.success && failure.data.code === 'archived'
						? 'dashboard.items.archivedError'
						: failure.success &&
							  (failure.data.code === 'forbidden' || failure.data.code === 'unauthorized')
							? 'dashboard.items.forbiddenError'
							: failure.success && failure.data.code === 'notFound'
								? 'dashboard.items.notFoundError'
								: failure.success && failure.data.code === 'invalid'
									? 'dashboard.items.nameInvalid'
									: 'dashboard.items.networkError';
				rollback(campaign, previousName, key);
			}
		} catch {
			rollback(campaign, previousName, 'dashboard.items.networkError');
		} finally {
			pendingId = null;
		}
	};
</script>

{#if notice}
	<div class="mb-5">
		<Toast
			title={notice.variant === 'error'
				? t(locale, 'common.error')
				: t(locale, 'dashboard.items.updated')}
			message={notice.text}
			variant={notice.variant}
			onDismiss={() => (notice = null)}
		/>
	</div>
{/if}

<p role="status" class="mb-4 text-caption font-semibold text-muted">
	{t(locale, 'dashboard.items.results', {
		start: formatNumber(firstRow, locale),
		end: formatNumber(lastRow, locale),
		total: formatNumber(pageData.total, locale)
	})}
</p>

{#if pageData.rows.length === 0}
	<Card>
		<h2 class="text-subheading font-bold">{t(locale, 'dashboard.items.empty')}</h2>
		<p class="mt-3 text-caption text-muted">{t(locale, 'dashboard.items.emptyHint')}</p>
		<a
			href={dashboardItemsHref(locale)}
			class="mt-5 inline-block text-caption font-bold text-accent hover:text-accent-hover"
			>{t(locale, 'dashboard.items.clear')}</a
		>
	</Card>
{:else}
	<Card padding="none" class="overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full min-w-[70rem] border-collapse text-left text-caption">
				<caption class="sr-only">{t(locale, 'dashboard.items.title')}</caption>
				<thead class="bg-surface-muted/70 text-xs uppercase tracking-[0.1em] text-muted">
					<tr>
						<th scope="col" aria-sort={sortOrder(CAMPAIGN_SORT.NAME)} class="px-5 py-4"
							><a href={sortHref(CAMPAIGN_SORT.NAME)} class="font-bold hover:text-foreground"
								>{t(locale, 'dashboard.items.column.name')} ↕</a
							></th
						>
						<th scope="col" class="px-4 py-4">{t(locale, 'dashboard.items.column.status')}</th>
						<th scope="col" class="px-4 py-4">{t(locale, 'dashboard.items.column.channel')}</th>
						<th scope="col" class="px-4 py-4">{t(locale, 'dashboard.items.column.owner')}</th>
						<th scope="col" aria-sort={sortOrder(CAMPAIGN_SORT.BUDGET)} class="px-4 py-4"
							><a href={sortHref(CAMPAIGN_SORT.BUDGET)} class="font-bold hover:text-foreground"
								>{t(locale, 'dashboard.items.column.budget')} ↕</a
							></th
						>
						<th scope="col" class="px-4 py-4">{t(locale, 'dashboard.items.column.spent')}</th>
						<th scope="col" class="px-4 py-4">{t(locale, 'dashboard.items.column.ctr')}</th>
						<th scope="col" aria-sort={sortOrder(CAMPAIGN_SORT.UPDATED_AT)} class="px-4 py-4"
							><a href={sortHref(CAMPAIGN_SORT.UPDATED_AT)} class="font-bold hover:text-foreground"
								>{t(locale, 'dashboard.items.column.updated')} ↕</a
							></th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-border/60">
					{#each pageData.rows as campaign (campaign.id)}
						<tr class="align-middle hover:bg-surface-muted/35">
							<td class="px-5 py-4">
								{#if editingId === campaign.id}
									<form
										onsubmit={(event) => submitRename(event, campaign)}
										class="flex min-w-[18rem] flex-wrap items-end gap-2"
									>
										<div class="min-w-[12rem] flex-1">
											<label for={`campaign-name-${campaign.id}`} class="sr-only"
												>{t(locale, 'dashboard.items.column.name')}</label
											>
											<input
												id={`campaign-name-${campaign.id}`}
												name="name"
												maxlength={80}
												value={draftName}
												oninput={(event) => (draftName = event.currentTarget.value)}
												aria-invalid={editingError ? true : undefined}
												aria-describedby={editingError
													? `campaign-name-error-${campaign.id}`
													: undefined}
												class="ui-field-control min-h-9 w-full"
											/>
											{#if editingError}<p
													id={`campaign-name-error-${campaign.id}`}
													class="ui-field-error"
												>
													{editingError}
												</p>{/if}
										</div>
										<Button type="submit" size="sm">{t(locale, 'common.save')}</Button>
										<Button
											type="button"
											size="sm"
											variant="ghost"
											onclick={() => cancelEdit(campaign.id)}>{t(locale, 'common.cancel')}</Button
										>
									</form>
								{:else}
									<div class="flex items-center gap-3">
										<span class="min-w-0 font-semibold text-foreground"
											>{displayName(campaign)}</span
										>
										{#if pendingId === campaign.id}<span role="status" class="text-xs text-accent"
												>{t(locale, 'dashboard.items.updating')}</span
											>{/if}
										{#if canEdit}<button
												id={`edit-campaign-${campaign.id}`}
												type="button"
												disabled={pendingId !== null}
												aria-label={`${t(locale, 'dashboard.items.edit')}: ${displayName(campaign)}`}
												onclick={() => startEdit(campaign)}
												class="shrink-0 rounded-control px-2 py-1 text-xs font-bold text-accent hover:bg-accent-soft disabled:opacity-50"
												>{t(locale, 'dashboard.items.edit')}</button
											>{/if}
									</div>
								{/if}
							</td>
							<td class="px-4 py-4"
								><Badge variant={campaignStatusVariants[campaign.status]}
									>{t(locale, campaignStatusLabelKeys[campaign.status])}</Badge
								></td
							>
							<td class="px-4 py-4 text-muted"
								>{t(locale, campaignChannelLabelKeys[campaign.channel])}</td
							>
							<td class="px-4 py-4 text-muted">{campaign.owner.name}</td>
							<td class="px-4 py-4 font-semibold">{formatCurrency(campaign.budget, locale)}</td>
							<td class="px-4 py-4 text-muted">{formatCurrency(campaign.spent, locale)}</td>
							<td class="px-4 py-4 text-muted">{formatCtr(campaign.ctr)}</td>
							<td class="px-4 py-4 text-muted">{formatDate(campaign.updatedAt, locale)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Card>
{/if}

<nav
	aria-label={t(locale, 'dashboard.items.pagination')}
	class="mt-6 flex flex-wrap items-center justify-between gap-4 text-caption"
>
	<a
		href={pageData.page > 1 ? pageHref(pageData.page - 1) : undefined}
		aria-disabled={pageData.page <= 1 ? true : undefined}
		class={`rounded-control border border-border-strong px-4 py-2 font-semibold ${pageData.page <= 1 ? 'pointer-events-none opacity-50' : 'hover:border-accent hover:bg-surface-raised'}`}
		>{t(locale, 'dashboard.items.previous')}</a
	>
	<span class="font-semibold text-muted"
		>{t(locale, 'dashboard.items.page', { page: pageData.page, pages: pageData.pageCount })}</span
	>
	<a
		href={pageData.page < pageData.pageCount ? pageHref(pageData.page + 1) : undefined}
		aria-disabled={pageData.page >= pageData.pageCount ? true : undefined}
		class={`rounded-control border border-border-strong px-4 py-2 font-semibold ${pageData.page >= pageData.pageCount ? 'pointer-events-none opacity-50' : 'hover:border-accent hover:bg-surface-raised'}`}
		>{t(locale, 'dashboard.items.next')}</a
	>
</nav>
