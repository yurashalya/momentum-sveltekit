<script lang="ts">
	import LoginPage from '#lib/components/pages/login/LoginPage.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<LoginPage {form} />
