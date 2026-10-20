<script lang="ts">
	import { resolve } from '$app/paths';
	import favicon from '#lib/assets/favicon.svg';
	import Container from '#lib/components/ui/Container.svelte';
	import { useLocale } from '#lib/i18n/context.js';
	import { t } from '#lib/i18n/index.js';
	import { localeHomePath } from '#lib/i18n/paths.js';
	import { footerLinks } from './constants';

	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
	let homeHref = $derived(resolve(localeHomePath(locale)));
</script>

<footer class="border-t border-border/60 bg-surface/40 py-10">
	<Container class="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<a href={homeHref} class="inline-flex items-center gap-2.5 font-bold text-foreground">
				<img src={favicon} alt="" width="28" height="28" class="h-7 w-7" />
				Momentum
			</a>
			<p class="mt-2 text-caption text-muted">{t(locale, 'footer.tagline')}</p>
		</div>
		<nav
			aria-label={t(locale, 'footer.navLabel')}
			class="flex flex-wrap gap-x-6 gap-y-3 text-caption font-semibold text-muted"
		>
			{#each footerLinks as link (link.href)}
				<a href={resolve(`${localeHomePath(locale)}${link.href}`)} class="hover:text-foreground"
					>{t(locale, link.labelKey)}</a
				>
			{/each}
		</nav>
	</Container>
	<Container class="mt-8 border-t border-border/60 pt-5 text-caption text-muted">
		© Momentum. {t(locale, 'footer.disclaimer')}
	</Container>
</footer>
