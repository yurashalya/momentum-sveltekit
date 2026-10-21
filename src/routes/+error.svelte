<script lang="ts">
	import { page } from '$app/state';
	import ErrorPage from '#lib/components/pages/error/ErrorPage.svelte';
</script>

<ErrorPage status={page.status} />
