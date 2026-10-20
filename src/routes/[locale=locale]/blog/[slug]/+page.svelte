<script lang="ts">
	import BlogArticlePage from '#lib/components/pages/blog/BlogArticlePage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<BlogArticlePage {...data} />
