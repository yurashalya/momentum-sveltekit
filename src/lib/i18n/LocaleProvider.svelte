<script lang="ts">
	import type { Snippet } from 'svelte';
	import { provideLocale } from './context.js';
	import type { Locale } from './index.js';

	let { locale, children }: { locale: Locale; children: Snippet } = $props();
	provideLocale(() => locale);
</script>

{@render children()}
