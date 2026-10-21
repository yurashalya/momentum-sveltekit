<script lang="ts">
	import { resolve } from '$app/paths';
	import favicon from '#lib/assets/favicon.svg';
	import Card from '#lib/components/ui/Card.svelte';
	import Container from '#lib/components/ui/Container.svelte';
	import Heading from '#lib/components/ui/Heading.svelte';
	import type { PublicUser } from '#lib/features/auth/schema.js';
	import { useLocale } from '#lib/i18n/context.js';
	import { LOCALE, t } from '#lib/i18n/index.js';
	import { localeHomePath } from '#lib/i18n/paths.js';

	let { user }: { user: PublicUser } = $props();
	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
	let logoutHref = $derived(
		locale === LOCALE.DE ? resolve('/logout?locale=de') : resolve('/logout')
	);
</script>

<svelte:head>
	<title>{t(locale, 'dashboard.title')} — Momentum</title>
	<meta name="robots" content="noindex,nofollow" />
</svelte:head>

<div class="min-h-screen bg-canvas text-foreground">
	<header class="border-b border-border/60 bg-canvas/90 py-4">
		<Container class="flex items-center justify-between gap-4">
			<a
				href={resolve(localeHomePath(locale))}
				class="inline-flex items-center gap-3 font-bold tracking-tight text-foreground"
			>
				<img src={favicon} alt="" width="36" height="36" class="h-9 w-9" />
				Momentum
			</a>
			<nav
				aria-label={t(locale, 'nav.languageLabel')}
				class="ml-auto flex items-center gap-2 text-xs font-bold text-muted"
			>
				<a
					href={resolve('/dashboard')}
					lang="en"
					aria-current={locale === LOCALE.EN ? 'page' : undefined}
					class={locale === LOCALE.EN ? 'text-foreground' : 'hover:text-foreground'}>EN</a
				>
				<a
					href={resolve('/de/dashboard')}
					lang="de"
					aria-current={locale === LOCALE.DE ? 'page' : undefined}
					class={locale === LOCALE.DE ? 'text-foreground' : 'hover:text-foreground'}>DE</a
				>
			</nav>
			<form method="POST" action={logoutHref}>
				<button
					type="submit"
					class="rounded-control border border-border-strong px-4 py-2 text-caption font-semibold text-foreground transition-colors hover:border-accent hover:bg-surface-raised"
				>
					{t(locale, 'nav.logout')}
				</button>
			</form>
		</Container>
	</header>
	<main id="main" class="py-section">
		<Container>
			<p class="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-accent">
				{t(locale, 'dashboard.eyebrow')}
			</p>
			<Heading level={1}>{t(locale, 'dashboard.title')}</Heading>
			<p class="mt-5 max-w-2xl text-lg text-muted">
				{t(locale, 'dashboard.welcome', { name: user.name })}
			</p>
			<Card class="mt-10 max-w-2xl">
				<Heading level={2} class="text-subheading">{t(locale, 'dashboard.previewTitle')}</Heading>
				<p class="mt-3 text-caption text-muted">{t(locale, 'dashboard.previewText')}</p>
			</Card>
		</Container>
	</main>
</div>
