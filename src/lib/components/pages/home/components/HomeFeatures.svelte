<script lang="ts">
	import Card from '#lib/components/ui/Card.svelte';
	import Container from '#lib/components/ui/Container.svelte';
	import Heading from '#lib/components/ui/Heading.svelte';
	import { useLocale } from '#lib/i18n/context.js';
	import { t } from '#lib/i18n/index.js';

	import { features } from '../content';

	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
</script>

<section
	id="features"
	aria-labelledby="features-title"
	class="border-t border-border/60 py-section scroll-mt-8"
>
	<Container>
		<div class="mb-10 max-w-2xl">
			<p class="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-accent">
				{t(locale, 'home.features.eyebrow')}
			</p>
			<Heading level={2}
				><span id="features-title">{t(locale, 'home.features.title')}</span></Heading
			>
			<p class="mt-4 text-lg text-muted">
				{t(locale, 'home.features.description')}
			</p>
		</div>
		<div class="grid gap-5 md:grid-cols-3">
			{#each features as feature (feature.number)}
				<Card class="h-full">
					<div class="mb-12 flex items-center justify-between">
						<span class="text-xs font-bold tracking-[0.16em] text-accent">{feature.number}</span>
						<span aria-hidden="true" class="text-xl text-accent">↗</span>
					</div>
					<Heading level={3}>{t(locale, feature.titleKey)}</Heading>
					<p class="mt-3 text-caption leading-relaxed text-muted">
						{t(locale, feature.descriptionKey)}
					</p>
				</Card>
			{/each}
		</div>
	</Container>
</section>
