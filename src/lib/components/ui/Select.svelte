<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';

	type Props = Omit<HTMLSelectAttributes, 'id' | 'value' | 'children'> & {
		id: string;
		label: string;
		options: readonly { value: string; label: string; disabled?: boolean }[];
		value?: string;
		hint?: string;
		error?: string;
	};

	let {
		id,
		label,
		options,
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
	<select
		{...rest}
		{id}
		bind:value
		aria-invalid={error ? true : undefined}
		aria-describedby={descriptionIds}
		class={`ui-field-control min-h-11 ${className}`}
	>
		{#each options as option (option.value)}
			<option value={option.value} disabled={option.disabled}>{option.label}</option>
		{/each}
	</select>
	{#if hint}<p id={`${id}-hint`} class="ui-field-hint">{hint}</p>{/if}
	{#if error}<p id={`${id}-error`} class="ui-field-error">{error}</p>{/if}
</div>
