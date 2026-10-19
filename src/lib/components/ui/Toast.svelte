<script lang="ts">
	type Variant = 'info' | 'success' | 'error';
	let {
		title,
		message,
		variant = 'info',
		onDismiss,
		dismissLabel = 'Dismiss notification'
	}: {
		title: string;
		message: string;
		variant?: Variant;
		onDismiss?: () => void;
		dismissLabel?: string;
	} = $props();

	const accents: Record<Variant, string> = {
		info: 'border-l-accent',
		success: 'border-l-success',
		error: 'border-l-danger'
	};
</script>

<div
	role={variant === 'error' ? 'alert' : 'status'}
	class={`flex items-start gap-4 rounded-card border border-border/60 border-l-4 bg-surface bg-panel p-4 text-foreground shadow-card ${accents[variant]}`}
>
	<div class="min-w-0 flex-1">
		<p class="font-semibold">{title}</p>
		<p class="mt-1 text-caption text-muted">{message}</p>
	</div>
	{#if onDismiss}
		<button
			type="button"
			class="rounded-control p-1 text-muted hover:text-foreground"
			aria-label={dismissLabel}
			onclick={onDismiss}>×</button
		>
	{/if}
</div>
