<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary';
	type Props = Omit<HTMLAnchorAttributes, 'children'> & {
		children: Snippet;
		variant?: Variant;
	};

	let { children, variant = 'primary', class: className = '', ...rest }: Props = $props();

	const variants: Record<Variant, string> = {
		primary:
			'bg-action text-action-foreground shadow-action hover:-translate-y-0.5 hover:brightness-110',
		secondary:
			'border border-border-strong bg-surface-raised/70 text-foreground hover:border-accent/70 hover:bg-surface-raised'
	};
</script>

<a
	{...rest}
	class={`inline-flex min-h-12 items-center justify-center gap-2 rounded-control px-6 text-caption font-bold transition-all duration-200 ${variants[variant]} ${className}`}
>
	{@render children()}
</a>
