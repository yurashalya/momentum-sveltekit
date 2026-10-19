<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		level = 2,
		class: className = ''
	}: {
		children: Snippet;
		level?: 1 | 2 | 3 | 4 | 5 | 6;
		class?: string;
	} = $props();

	let tag = $derived(`h${level}`);
	let size = $derived(
		level === 1 ? 'text-display' : level === 2 ? 'text-heading' : 'text-subheading'
	);
</script>

<svelte:element
	this={tag}
	class={`font-bold tracking-[-0.045em] text-foreground ${size} ${className}`}
>
	{@render children()}
</svelte:element>
