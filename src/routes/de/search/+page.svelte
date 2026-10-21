<script lang="ts">
	import SearchPage from '#lib/components/pages/search/SearchPage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<SearchPage {...data} />
