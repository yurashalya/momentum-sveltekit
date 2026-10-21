<script lang="ts">
	import { untrack } from 'svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import Input from '#lib/components/ui/Input.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import {
		CAMPAIGN_LIST_DEFAULTS,
		CAMPAIGN_SORT,
		SORT_DIRECTION
	} from '#lib/features/campaigns/constants.js';
	import {
		campaignChannelSchema,
		campaignStatusSchema,
		type CampaignListParams
	} from '#lib/features/campaigns/schema.js';
	import { useLocale } from '#lib/i18n/context.js';
	import { t } from '#lib/i18n/index.js';
	import { dashboardItemsHref } from '#lib/i18n/hrefs.js';
	import { campaignChannelLabelKeys, campaignStatusLabelKeys } from '../constants.js';

	let { filters }: { filters: CampaignListParams } = $props();
	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
	let q = $state(untrack(() => filters.q));
	let status = $state(untrack(() => filters.status));
	let channel = $state(untrack(() => filters.channel));
	let sort = $state(untrack(() => filters.sort));
	let dir = $state(untrack(() => filters.dir));

	$effect(() => {
		q = filters.q;
		status = filters.status;
		channel = filters.channel;
		sort = filters.sort;
		dir = filters.dir;
	});

	let statusOptions = $derived([
		{ value: CAMPAIGN_LIST_DEFAULTS.FILTER, label: t(locale, 'dashboard.items.allStatuses') },
		...campaignStatusSchema.options.map((value) => ({
			value,
			label: t(locale, campaignStatusLabelKeys[value])
		}))
	]);
	let channelOptions = $derived([
		{ value: CAMPAIGN_LIST_DEFAULTS.FILTER, label: t(locale, 'dashboard.items.allChannels') },
		...campaignChannelSchema.options.map((value) => ({
			value,
			label: t(locale, campaignChannelLabelKeys[value])
		}))
	]);
	let sortOptions = $derived([
		{ value: CAMPAIGN_SORT.UPDATED_AT, label: t(locale, 'dashboard.items.sort.updatedAt') },
		{ value: CAMPAIGN_SORT.NAME, label: t(locale, 'dashboard.items.sort.name') },
		{ value: CAMPAIGN_SORT.BUDGET, label: t(locale, 'dashboard.items.sort.budget') }
	]);
	let directionOptions = $derived([
		{ value: SORT_DIRECTION.DESC, label: t(locale, 'dashboard.items.direction.desc') },
		{ value: SORT_DIRECTION.ASC, label: t(locale, 'dashboard.items.direction.asc') }
	]);
</script>

<Card variant="muted">
	<form
		method="GET"
		action={dashboardItemsHref(locale)}
		class="grid gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))]"
	>
		<Input
			id="campaign-query"
			name="q"
			type="search"
			maxlength={100}
			label={t(locale, 'dashboard.items.search')}
			placeholder={t(locale, 'dashboard.items.searchHint')}
			bind:value={q}
		/>
		<Select
			id="campaign-status"
			name="status"
			label={t(locale, 'dashboard.items.statusFilter')}
			options={statusOptions}
			bind:value={status}
		/>
		<Select
			id="campaign-channel"
			name="channel"
			label={t(locale, 'dashboard.items.channelFilter')}
			options={channelOptions}
			bind:value={channel}
		/>
		<Select
			id="campaign-sort"
			name="sort"
			label={t(locale, 'dashboard.items.sortFilter')}
			options={sortOptions}
			bind:value={sort}
		/>
		<Select
			id="campaign-direction"
			name="dir"
			label={t(locale, 'dashboard.items.directionFilter')}
			options={directionOptions}
			bind:value={dir}
		/>
		<div class="flex flex-wrap items-center gap-3 sm:col-span-2 xl:col-span-5">
			<Button type="submit">{t(locale, 'dashboard.items.apply')}</Button>
			<a
				href={dashboardItemsHref(locale)}
				class="rounded-control px-4 py-2 text-caption font-semibold text-muted hover:text-foreground"
				>{t(locale, 'dashboard.items.clear')}</a
			>
		</div>
	</form>
</Card>
