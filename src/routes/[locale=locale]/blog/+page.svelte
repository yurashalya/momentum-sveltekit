<script lang="ts">
	import BlogListPage from '#lib/components/pages/blog/BlogListPage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<BlogListPage {...data} />
