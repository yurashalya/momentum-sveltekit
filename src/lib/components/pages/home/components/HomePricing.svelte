<script lang="ts">
	import Badge from '#lib/components/ui/Badge.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import Container from '#lib/components/ui/Container.svelte';
	import Heading from '#lib/components/ui/Heading.svelte';
	import { useLocale } from '#lib/i18n/context.js';
	import { formatCurrency, t } from '#lib/i18n/index.js';

	import { plans } from '../content';

	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
</script>

<section
	id="pricing"
	aria-labelledby="pricing-title"
	class="scroll-mt-8 border-y border-border/60 bg-surface/35 py-section"
>
	<Container>
		<div class="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
			<div class="max-w-2xl">
				<p class="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-accent">
					{t(locale, 'nav.pricing')}
				</p>
				<Heading level={2}
					><span id="pricing-title">{t(locale, 'home.pricing.title')}</span></Heading
				>
				<p class="mt-4 text-lg text-muted">
					{t(locale, 'home.pricing.description')}
				</p>
			</div>
			<p class="max-w-xs text-caption text-muted">
				{t(locale, 'home.pricing.note')}
			</p>
		</div>
		<div class="grid gap-5 lg:grid-cols-3">
			{#each plans as plan (plan.id)}
				<Card variant={plan.featured ? 'featured' : 'default'} class="flex h-full flex-col">
					<div class="flex min-h-7 items-center justify-between gap-2">
						<p class="font-bold text-foreground">{t(locale, plan.nameKey)}</p>
						{#if plan.featured}<Badge variant="accent">{t(locale, 'home.pricing.popular')}</Badge
							>{/if}
					</div>
					<p class="mt-7 flex flex-wrap items-baseline gap-1.5">
						<strong class="text-4xl font-bold tracking-tight text-foreground"
							>{plan.price === null
								? t(locale, 'home.pricing.custom')
								: formatCurrency(plan.price, locale)}</strong
						>
						{#if plan.periodKey}<span class="text-caption text-muted"
								>{t(locale, plan.periodKey)}</span
							>{/if}
					</p>
					<p class="mt-4 min-h-12 text-caption text-muted">{t(locale, plan.descriptionKey)}</p>
					<div class="my-6 h-px bg-border/60"></div>
					<ul class="space-y-3 text-caption text-foreground">
						{#each plan.featureKeys as included (included)}
							<li class="flex items-start gap-3">
								<span aria-hidden="true" class="text-highlight">✓</span>
								<span>{t(locale, included)}</span>
							</li>
						{/each}
					</ul>
				</Card>
			{/each}
		</div>
	</Container>
</section>
