<script lang="ts">
	import DashboardShell from '#lib/components/pages/dashboard/DashboardShell.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<DashboardShell user={data.user}>{@render children()}</DashboardShell>
