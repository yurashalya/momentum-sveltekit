<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
	type Size = 'sm' | 'md' | 'lg';
	type Props = Omit<HTMLButtonAttributes, 'children'> & {
		children: Snippet;
		variant?: Variant;
		size?: Size;
		loading?: boolean;
	};

	let {
		children,
		variant = 'primary',
		size = 'md',
		loading = false,
		disabled = false,
		class: className = '',
		type = 'button',
		...rest
	}: Props = $props();

	const variants: Record<Variant, string> = {
		primary:
			'bg-action text-action-foreground shadow-action hover:-translate-y-0.5 hover:brightness-110',
		secondary:
			'border border-border-strong bg-surface-raised/70 text-foreground hover:border-accent/70 hover:bg-surface-raised',
		ghost: 'text-foreground hover:bg-surface-muted',
		danger: 'bg-danger text-danger-foreground hover:bg-danger-hover'
	};
	const sizes: Record<Size, string> = {
		sm: 'min-h-9 px-3.5 text-caption',
		md: 'min-h-11 px-5 text-caption',
		lg: 'min-h-12 px-6 text-body'
	};
</script>

<button
	{...rest}
	{type}
	disabled={disabled || loading}
	aria-busy={loading || undefined}
	class={`inline-flex items-center justify-center gap-2 rounded-control font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${variants[variant]} ${sizes[size]} ${className}`}
>
	{#if loading}
		<span
			aria-hidden="true"
			class="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
		></span>
	{/if}
	{@render children()}
</button>
