<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';
	let {
		children,
		variant = 'neutral',
		class: className = ''
	}: {
		children: Snippet;
		variant?: Variant;
		class?: string;
	} = $props();

	const variants: Record<Variant, string> = {
		neutral: 'border-border/70 bg-surface-muted text-foreground',
		accent: 'border-accent/30 bg-accent-soft text-accent',
		success: 'border-success/30 bg-success-soft text-success',
		warning: 'border-warning/30 bg-warning-soft text-warning',
		danger: 'border-danger/30 bg-danger-soft text-danger'
	};
</script>

<span
	class={`inline-flex items-center rounded-pill border px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] ${variants[variant]} ${className}`}
>
	{@render children()}
</span>
