<script lang="ts">
	import DashboardPage from '#lib/components/pages/dashboard/DashboardPage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<DashboardPage user={data.user} overview={data.overview} />
