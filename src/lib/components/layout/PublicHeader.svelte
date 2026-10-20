<script lang="ts">
	import { resolve } from '$app/paths';
	import favicon from '#lib/assets/favicon.svg';
	import Container from '#lib/components/ui/Container.svelte';
	import { useLocale } from '#lib/i18n/context.js';
	import { LOCALE, t } from '#lib/i18n/index.js';
	import { localeHomePath } from '#lib/i18n/paths.js';
	import { publicSectionLinks } from './constants';
	import ThemeToggle from './ThemeToggle.svelte';

	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
	let homeHref = $derived(resolve(localeHomePath(locale)));
</script>

<a
	href="#main"
	class="sr-only fixed left-4 top-4 z-50 rounded-control bg-action px-4 py-2 font-semibold text-action-foreground focus:not-sr-only"
>
	{t(locale, 'nav.skipToContent')}
</a>

<header class="relative z-20 border-b border-border/60 bg-canvas/90 backdrop-blur-xl">
	<Container class="flex flex-wrap items-center gap-x-6 gap-y-4 py-4">
		<a
			href={homeHref}
			class="inline-flex items-center gap-3 font-bold tracking-tight text-foreground"
			aria-label={t(locale, 'nav.homeLabel')}
		>
			<img src={favicon} alt="" width="36" height="36" class="h-9 w-9" />
			<span>Momentum</span>
		</a>

		<nav
			aria-label={t(locale, 'nav.primaryLabel')}
			class="order-3 flex w-full items-center gap-6 text-caption font-semibold text-muted sm:order-2 sm:ml-auto sm:w-auto"
		>
			{#each publicSectionLinks as link (link.href)}
				<a
					href={resolve(`${localeHomePath(locale)}${link.href}`)}
					class="transition-colors hover:text-foreground"
				>
					{t(locale, link.labelKey)}
				</a>
			{/each}
		</nav>

		<div class="order-2 ml-auto flex items-center gap-3 sm:order-3 sm:ml-0">
			<nav
				aria-label={t(locale, 'nav.languageLabel')}
				class="flex items-center gap-1 text-xs font-bold text-muted"
			>
				<a
					href={resolve(localeHomePath(LOCALE.EN))}
					lang={LOCALE.EN}
					aria-current={locale === LOCALE.EN ? 'page' : undefined}
					class={`rounded-control px-2 py-1.5 transition-colors hover:text-foreground ${locale === LOCALE.EN ? 'bg-surface-raised text-foreground' : ''}`}
					>EN<span class="sr-only"> — {t(locale, 'nav.languageEnglish')}</span></a
				>
				<a
					href={resolve(localeHomePath(LOCALE.DE))}
					lang={LOCALE.DE}
					aria-current={locale === LOCALE.DE ? 'page' : undefined}
					class={`rounded-control px-2 py-1.5 transition-colors hover:text-foreground ${locale === LOCALE.DE ? 'bg-surface-raised text-foreground' : ''}`}
					>DE<span class="sr-only"> — {t(locale, 'nav.languageGerman')}</span></a
				>
			</nav>
			<ThemeToggle />
		</div>
	</Container>
</header>
