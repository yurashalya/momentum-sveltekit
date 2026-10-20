<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { useLocale } from '#lib/i18n/context.js';
	import { t } from '#lib/i18n/index.js';

	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
	let isLight = $state(false);

	onMount(() => {
		isLight = document.documentElement.classList.contains('light');
	});

	const applyTheme = (nextIsLight: boolean) => {
		isLight = nextIsLight;
		document.documentElement.classList.toggle('light', nextIsLight);

		try {
			localStorage.setItem('momentum-theme', nextIsLight ? 'light' : 'dark');
		} catch {
			return;
		}
	};

	const toggleTheme = () => {
		const nextIsLight = !isLight;

		if (
			window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
			!document.startViewTransition
		) {
			applyTheme(nextIsLight);
			return;
		}

		document.startViewTransition(async () => {
			applyTheme(nextIsLight);
			await tick();
		});
	};
</script>

<button
	type="button"
	aria-label={t(locale, isLight ? 'theme.switchToDark' : 'theme.switchToLight')}
	aria-pressed={isLight}
	onclick={toggleTheme}
	class="inline-flex h-10 w-10 items-center justify-center rounded-control border border-border bg-surface text-muted transition-colors hover:border-accent/70 hover:text-foreground"
>
	{#if isLight}
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			class="h-5 w-5"
			stroke="currentColor"
			stroke-width="1.8"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M20.2 15.3A8.5 8.5 0 0 1 8.7 3.8 8.5 8.5 0 1 0 20.2 15.3Z" />
		</svg>
	{:else}
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			class="h-5 w-5"
			stroke="currentColor"
			stroke-width="1.8"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="12" cy="12" r="4" />
			<path
				d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
			/>
		</svg>
	{/if}
</button>
