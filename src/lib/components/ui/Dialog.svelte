<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		id,
		title,
		description,
		children,
		footer,
		open = $bindable(false),
		closeLabel = 'Close dialog'
	}: {
		id: string;
		title: string;
		description?: string;
		children: Snippet;
		footer?: Snippet;
		open?: boolean;
		closeLabel?: string;
	} = $props();

	let element: HTMLDialogElement;
	let previousFocus: HTMLElement | null = null;

	$effect(() => {
		if (!element) return;
		if (open && !element.open) {
			previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
			element.showModal();
		} else if (!open && element.open) {
			element.close();
		}
	});

	const close = () => {
		open = false;
	};

	const handleClose = () => {
		open = false;
		previousFocus?.focus();
	};

	const handleCancel = (event: Event) => {
		event.preventDefault();
		close();
	};

	const handleBackdropClick = (event: MouseEvent) => {
		if (event.target !== element) return;
		const bounds = element.getBoundingClientRect();
		if (
			event.clientX < bounds.left ||
			event.clientX > bounds.right ||
			event.clientY < bounds.top ||
			event.clientY > bounds.bottom
		) {
			close();
		}
	};
</script>

<dialog
	bind:this={element}
	aria-labelledby={`${id}-title`}
	aria-describedby={description ? `${id}-description` : undefined}
	aria-modal="true"
	onclose={handleClose}
	oncancel={handleCancel}
	onclick={handleBackdropClick}
	class="w-[min(32rem,calc(100%-2rem))] rounded-card border border-border bg-surface p-0 text-foreground shadow-card backdrop:bg-overlay/70 backdrop:backdrop-blur-sm"
>
	<div class="border-b border-border/60 px-card py-5">
		<div class="flex items-start justify-between gap-4">
			<h2 id={`${id}-title`} class="text-subheading font-bold tracking-tight">{title}</h2>
			<button
				type="button"
				class="rounded-control p-1 text-muted hover:text-foreground"
				aria-label={closeLabel}
				onclick={close}>×</button
			>
		</div>
		{#if description}<p id={`${id}-description`} class="mt-2 text-caption text-muted">
				{description}
			</p>{/if}
	</div>
	<div class="px-card py-5">{@render children()}</div>
	{#if footer}<div class="flex flex-wrap justify-end gap-3 border-t border-border/60 px-card py-4">
			{@render footer()}
		</div>{/if}
</dialog>
