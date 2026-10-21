<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';
	import favicon from '#lib/assets/favicon.svg';
	import Container from '#lib/components/ui/Container.svelte';
	import type { PublicUser } from '#lib/features/auth/schema.js';
	import { useLocale } from '#lib/i18n/context.js';
	import { LOCALE, t } from '#lib/i18n/index.js';
	import { dashboardHref, dashboardItemsHref } from '#lib/i18n/hrefs.js';
	import { localeHomePath } from '#lib/i18n/paths.js';

	let { user, children }: { user: PublicUser; children: Snippet } = $props();
	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
	let isItemsRoute = $derived(page.url.pathname.endsWith('/dashboard/items'));
	let englishHref = $derived(
		isItemsRoute ? dashboardItemsHref(LOCALE.EN, page.url.searchParams) : dashboardHref(LOCALE.EN)
	);
	let germanHref = $derived(
		isItemsRoute ? dashboardItemsHref(LOCALE.DE, page.url.searchParams) : dashboardHref(LOCALE.DE)
	);
	let logoutHref = $derived(
		locale === LOCALE.DE ? resolve('/logout?locale=de') : resolve('/logout')
	);
</script>

<a
	href="#main"
	class="sr-only fixed left-4 top-4 z-50 rounded-control bg-action px-4 py-2 font-semibold text-action-foreground focus:not-sr-only"
>
	{t(locale, 'nav.skipToContent')}
</a>
<div class="flex min-h-screen flex-col bg-canvas text-foreground">
	<header class="border-b border-border/60 bg-canvas/90 py-4">
		<Container class="flex flex-wrap items-center gap-4">
			<a
				href={resolve(localeHomePath(locale))}
				class="inline-flex items-center gap-3 font-bold tracking-tight text-foreground"
			>
				<img src={favicon} alt="" width="36" height="36" class="h-9 w-9" />
				Momentum
			</a>
			<nav
				aria-label={t(locale, 'dashboard.title')}
				class="order-3 flex w-full items-center gap-5 text-caption font-semibold text-muted sm:order-2 sm:ml-6 sm:w-auto"
			>
				<a
					href={dashboardHref(locale)}
					aria-current={!isItemsRoute ? 'page' : undefined}
					class={!isItemsRoute ? 'text-foreground' : 'hover:text-foreground'}
					>{t(locale, 'dashboard.nav.overview')}</a
				>
				<a
					href={dashboardItemsHref(locale)}
					aria-current={isItemsRoute ? 'page' : undefined}
					class={isItemsRoute ? 'text-foreground' : 'hover:text-foreground'}
					>{t(locale, 'dashboard.nav.campaigns')}</a
				>
			</nav>
			<div class="order-2 ml-auto flex items-center gap-4 sm:order-3">
				<nav
					aria-label={t(locale, 'nav.languageLabel')}
					class="flex items-center gap-2 text-xs font-bold text-muted"
				>
					<a
						href={englishHref}
						lang="en"
						aria-current={locale === LOCALE.EN ? 'page' : undefined}
						class={locale === LOCALE.EN ? 'text-foreground' : 'hover:text-foreground'}>EN</a
					>
					<a
						href={germanHref}
						lang="de"
						aria-current={locale === LOCALE.DE ? 'page' : undefined}
						class={locale === LOCALE.DE ? 'text-foreground' : 'hover:text-foreground'}>DE</a
					>
				</nav>
				<span
					class="hidden max-w-28 truncate text-xs font-semibold text-muted lg:inline"
					title={user.email}>{user.name}</span
				>
				<form method="POST" action={logoutHref}>
					<button
						type="submit"
						class="rounded-control border border-border-strong px-4 py-2 text-caption font-semibold text-foreground transition-colors hover:border-accent hover:bg-surface-raised"
						>{t(locale, 'nav.logout')}</button
					>
				</form>
			</div>
		</Container>
	</header>
	{@render children()}
</div>
