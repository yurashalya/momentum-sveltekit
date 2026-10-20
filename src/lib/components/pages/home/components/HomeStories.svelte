<script lang="ts">
	import Card from '#lib/components/ui/Card.svelte';
	import Container from '#lib/components/ui/Container.svelte';
	import Heading from '#lib/components/ui/Heading.svelte';
	import { useLocale } from '#lib/i18n/context.js';
	import { t } from '#lib/i18n/index.js';

	import { testimonials } from '../content';

	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
</script>

<section id="stories" aria-labelledby="stories-title" class="scroll-mt-8 py-section">
	<Container>
		<div class="mb-10 max-w-2xl">
			<p class="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-accent">
				{t(locale, 'home.stories.eyebrow')}
			</p>
			<Heading level={2}><span id="stories-title">{t(locale, 'home.stories.title')}</span></Heading>
			<p class="mt-4 text-lg text-muted">
				{t(locale, 'home.stories.description')}
			</p>
		</div>
		<div class="grid gap-5 md:grid-cols-2">
			{#each testimonials as testimonial (testimonial.id)}
				<Card class="flex h-full flex-col justify-between">
					<span aria-hidden="true" class="text-5xl leading-none text-accent">“</span>
					<blockquote
						class="mt-4 text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl"
					>
						{t(locale, testimonial.quoteKey)}
					</blockquote>
					<div class="mt-9 flex items-center gap-3 border-t border-border/60 pt-5">
						<span
							aria-hidden="true"
							class="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent"
							>{t(locale, testimonial.initialsKey)}</span
						>
						<div>
							<p class="text-caption font-semibold text-foreground">
								{t(locale, testimonial.roleKey)}
							</p>
							<p class="text-xs text-muted">{t(locale, 'home.stories.note')}</p>
						</div>
					</div>
				</Card>
			{/each}
		</div>
	</Container>
</section>
