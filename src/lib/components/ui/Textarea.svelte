<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type Props = Omit<HTMLTextareaAttributes, 'id' | 'value' | 'children'> & {
		id: string;
		label: string;
		value?: string;
		hint?: string;
		error?: string;
	};

	let {
		id,
		label,
		value = $bindable(''),
		hint,
		error,
		class: className = '',
		...rest
	}: Props = $props();
	let descriptionIds = $derived(
		[hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
	);
</script>

<div class="grid gap-1.5">
	<label for={id} class="ui-field-label">{label}</label>
	<textarea
		{...rest}
		{id}
		bind:value
		aria-invalid={error ? true : undefined}
		aria-describedby={descriptionIds}
		class={`ui-field-control min-h-28 resize-y ${className}`}></textarea>
	{#if hint}<p id={`${id}-hint`} class="ui-field-hint">{hint}</p>{/if}
	{#if error}<p id={`${id}-error`} class="ui-field-error">{error}</p>{/if}
</div>
