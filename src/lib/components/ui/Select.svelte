<script lang="ts">
	type Option = { value: string; label: string; disabled?: boolean };
	type Props = {
		id: string;
		name?: string;
		label: string;
		options: readonly Option[];
		value?: string;
		disabled?: boolean;
		hint?: string;
		error?: string;
		class?: string;
	};

	let {
		id,
		name,
		label,
		options,
		value = $bindable(''),
		disabled = false,
		hint,
		error,
		class: className = ''
	}: Props = $props();

	let root: HTMLDivElement;
	let trigger: HTMLButtonElement;
	let open = $state(false);
	let activeIndex = $state(0);
	let selected = $derived(options.find((option) => option.value === value));
	let enabledIndexes = $derived(
		options.flatMap((option, index) => (option.disabled ? [] : [index]))
	);
	let descriptionIds = $derived(
		[hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
	);

	const show = () => {
		if (disabled || enabledIndexes.length === 0) return;
		const selectedIndex = options.findIndex((option) => option.value === value && !option.disabled);
		activeIndex = selectedIndex >= 0 ? selectedIndex : enabledIndexes[0];
		open = true;
	};

	const move = (direction: number) => {
		if (enabledIndexes.length === 0) return;
		const position = enabledIndexes.indexOf(activeIndex);
		const next = (position + direction + enabledIndexes.length) % enabledIndexes.length;
		activeIndex = enabledIndexes[next];
	};

	const choose = (index: number) => {
		if (options[index]?.disabled) return;
		value = options[index].value;
		open = false;
		trigger.focus();
	};

	const handleKeydown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp':
				event.preventDefault();
				if (!open) show();
				else move(event.key === 'ArrowDown' ? 1 : -1);
				break;
			case 'Home':
			case 'End':
				if (!open) break;
				event.preventDefault();
				activeIndex = event.key === 'Home' ? enabledIndexes[0] : enabledIndexes.at(-1)!;
				break;
			case 'Enter':
			case ' ':
				event.preventDefault();
				if (open) choose(activeIndex);
				else show();
				break;
			case 'Escape':
				if (open) {
					event.preventDefault();
					open = false;
				}
				break;
			case 'Tab':
				open = false;
				break;
		}
	};

	const handlePointerdown = (event: PointerEvent) => {
		if (open && !root?.contains(event.target as Node)) open = false;
	};
</script>

<svelte:window onpointerdown={handlePointerdown} />

<div bind:this={root} class="relative grid gap-1.5">
	<label id={`${id}-label`} for={id} class="ui-field-label">{label}</label>
	{#if name}<input type="hidden" {name} {value} />{/if}
	<button
		bind:this={trigger}
		type="button"
		{id}
		{disabled}
		role="combobox"
		aria-labelledby={`${id}-label`}
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-controls={`${id}-listbox`}
		aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
		aria-invalid={error ? true : undefined}
		aria-describedby={descriptionIds}
		onclick={() => (open ? (open = false) : show())}
		onkeydown={handleKeydown}
		class={`ui-field-control flex min-h-11 items-center justify-between pl-3.5 pr-4 text-left ${className}`}
	>
		<span class="min-w-0 truncate">{selected?.label ?? options[0]?.label ?? ''}</span>
		<svg
			class={`ml-4 mr-1 h-4 w-4 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			stroke-width="1.75"
			aria-hidden="true"
		>
			<path d="m5 7.5 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	</button>
	<div
		id={`${id}-listbox`}
		role="listbox"
		aria-labelledby={`${id}-label`}
		hidden={!open}
		class="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-control border border-border-strong bg-surface-raised p-1.5 shadow-card"
	>
		{#each options as option, index (option.value)}
			<button
				type="button"
				id={`${id}-option-${index}`}
				role="option"
				tabindex="-1"
				aria-selected={value === option.value}
				disabled={option.disabled}
				onpointerenter={() => {
					if (!option.disabled) activeIndex = index;
				}}
				onclick={() => choose(index)}
				class={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-caption font-medium transition-colors ${activeIndex === index ? 'bg-accent-soft text-foreground' : 'text-foreground hover:bg-surface-muted'} ${option.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
			>
				<span class="min-w-0 truncate">{option.label}</span>
				{#if value === option.value}
					<svg
						class="h-4 w-4 shrink-0 text-accent"
						viewBox="0 0 20 20"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path d="m4 10 4 4 8-8" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				{/if}
			</button>
		{/each}
	</div>
	{#if hint}<p id={`${id}-hint`} class="ui-field-hint">{hint}</p>{/if}
	{#if error}<p id={`${id}-error`} class="ui-field-error">{error}</p>{/if}
</div>
