<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = Omit<HTMLInputAttributes, 'id' | 'value'> & {
		id: string;
		label: string;
		value?: string;
		hint?: string;
		error?: string;
	};

	let {
		id,
		label,
		hint,
		error,
		value = $bindable(''),
		class: className = '',
		...rest
	}: Props = $props();
	let descriptionIds = $derived(
		[hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
	);
</script>

<div class="grid gap-1.5">
	<label for={id} class="ui-field-label">{label}</label>
	<input
		{...rest}
		{id}
		bind:value
		aria-invalid={error ? true : undefined}
		aria-describedby={descriptionIds}
		class={`ui-field-control min-h-11 ${className}`}
	/>
	{#if hint}<p id={`${id}-hint`} class="ui-field-hint">{hint}</p>{/if}
	{#if error}<p id={`${id}-error`} class="ui-field-error">{error}</p>{/if}
</div>
