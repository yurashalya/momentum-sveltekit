<script lang="ts">
	import ActionLink from '#lib/components/ui/ActionLink.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Container from '#lib/components/ui/Container.svelte';
	import Heading from '#lib/components/ui/Heading.svelte';
	import { useLocale } from '#lib/i18n/context.js';
	import { t } from '#lib/i18n/index.js';
	import HomePreview from './HomePreview.svelte';
	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
</script>

<section aria-labelledby="hero-title" class="relative isolate overflow-hidden">
	<div aria-hidden="true" class="hero-glow pointer-events-none absolute inset-0 -z-10"></div>
	<div aria-hidden="true" class="hero-grid pointer-events-none absolute inset-0 -z-10"></div>
	<Container
		class="grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.94fr)] lg:gap-12 lg:py-28"
	>
		<div class="max-w-2xl">
			<Badge variant="accent">{t(locale, 'home.hero.eyebrow')}</Badge>
			<Heading level={1} class="mt-6 max-w-[12ch]">
				<span id="hero-title"
					>{t(locale, 'home.hero.titleStart')}<br /><span class="text-accent"
						>{t(locale, 'home.hero.titleAccent')}</span
					></span
				>
			</Heading>
			<p class="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
				{t(locale, 'home.hero.subtitle')}
			</p>
			<div class="mt-9 flex flex-wrap gap-3">
				<ActionLink href="#features">
					{t(locale, 'home.hero.cta')} <span aria-hidden="true">↗</span>
				</ActionLink>
				<ActionLink href="#pricing" variant="secondary"
					>{t(locale, 'home.hero.plansCta')}</ActionLink
				>
			</div>
			<div
				class="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border/60 pt-6 text-caption text-muted"
			>
				<span class="flex items-center gap-2"
					><span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-highlight"></span>{t(
						locale,
						'home.hero.benefit1'
					)}</span
				>
				<span class="flex items-center gap-2"
					><span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-highlight"></span>{t(
						locale,
						'home.hero.benefit2'
					)}</span
				>
				<span class="flex items-center gap-2"
					><span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-highlight"></span>{t(
						locale,
						'home.hero.benefit3'
					)}</span
				>
			</div>
		</div>
		<HomePreview />
	</Container>
</section>

<style>
	.hero-glow {
		background:
			radial-gradient(circle at 16% 18%, rgb(var(--color-accent) / 0.13), transparent 35%),
			radial-gradient(circle at 83% 48%, rgb(var(--color-highlight) / 0.07), transparent 34%);
	}

	.hero-grid {
		background-image:
			linear-gradient(rgb(var(--color-border) / 0.14) 1px, transparent 1px),
			linear-gradient(90deg, rgb(var(--color-border) / 0.14) 1px, transparent 1px);
		background-size: 56px 56px;
		mask-image: linear-gradient(to bottom, rgb(0 0 0 / 0.48), transparent 88%);
	}
</style>
