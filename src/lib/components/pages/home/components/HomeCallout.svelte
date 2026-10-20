<script lang="ts">
	import ActionLink from '#lib/components/ui/ActionLink.svelte';
	import Container from '#lib/components/ui/Container.svelte';
	import Heading from '#lib/components/ui/Heading.svelte';
	import { useLocale } from '#lib/i18n/context.js';
	import { t } from '#lib/i18n/index.js';

	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
</script>

<section class="pb-section">
	<Container>
		<div
			class="relative overflow-hidden rounded-card border border-accent/30 bg-panel p-8 shadow-card sm:p-12"
		>
			<div
				aria-hidden="true"
				class="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
			></div>
			<div class="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
				<div class="max-w-2xl">
					<p class="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-accent">
						{t(locale, 'home.callout.eyebrow')}
					</p>
					<Heading level={2}>{t(locale, 'home.callout.title')}</Heading>
					<p class="mt-4 text-muted">{t(locale, 'home.callout.description')}</p>
				</div>
				<ActionLink href="#features" class="shrink-0"
					>{t(locale, 'home.callout.cta')} <span aria-hidden="true">↗</span></ActionLink
				>
			</div>
		</div>
	</Container>
</section>
