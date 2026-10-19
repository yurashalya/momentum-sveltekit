<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'default' | 'featured' | 'muted';
	type Padding = 'none' | 'sm' | 'md';

	let {
		children,
		variant = 'default',
		padding = 'md',
		class: className = ''
	}: {
		children: Snippet;
		variant?: Variant;
		padding?: Padding;
		class?: string;
	} = $props();

	const variants: Record<Variant, string> = {
		default: 'border-border/60 bg-surface bg-panel shadow-card',
		featured: 'border-accent/40 bg-surface bg-panel shadow-card ring-1 ring-accent/10',
		muted: 'border-border/50 bg-surface-muted/70'
	};
	const paddings: Record<Padding, string> = {
		none: '',
		sm: 'p-4',
		md: 'p-card'
	};
</script>

<div class={`rounded-card border ${variants[variant]} ${paddings[padding]} ${className}`}>
	{@render children()}
</div>
