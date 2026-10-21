<script lang="ts">
	import DashboardItemsPage from '#lib/components/pages/dashboard/DashboardItemsPage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<DashboardItemsPage state={data.state} result={data.result} user={data.user} />
