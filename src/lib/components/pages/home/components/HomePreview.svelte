<script lang="ts">
	import Badge from '#lib/components/ui/Badge.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import { useLocale } from '#lib/i18n/context.js';
	import { t } from '#lib/i18n/index.js';

	const currentLocale = useLocale();
	let locale = $derived(currentLocale());

	const bars = [32, 48, 42, 67, 54, 76, 63, 83, 72, 88, 75, 94] as const;
</script>

<aside
	aria-label={t(locale, 'home.preview.ariaLabel')}
	class="relative mx-auto w-full max-w-xl lg:mx-0"
>
	<div aria-hidden="true" class="absolute -inset-5 rounded-[2.5rem] bg-accent/10 blur-3xl"></div>
	<Card variant="featured" padding="none" class="relative overflow-hidden">
		<div
			class="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4 sm:px-6"
		>
			<div class="flex items-center gap-2.5">
				<span
					aria-hidden="true"
					class="h-2.5 w-2.5 rounded-full bg-highlight shadow-[0_0_14px_rgb(var(--color-highlight)_/_0.65)]"
				></span>
				<p class="text-caption font-bold text-foreground">{t(locale, 'home.preview.pulse')}</p>
			</div>
			<Badge variant="success">{t(locale, 'home.preview.live')}</Badge>
		</div>

		<div class="space-y-5 p-5 sm:p-6">
			<div class="flex items-start justify-between gap-4">
				<div>
					<p class="text-xs font-bold uppercase tracking-[0.16em] text-muted">
						{t(locale, 'home.preview.overview')}
					</p>
					<p class="mt-2 text-3xl font-bold tracking-tight text-foreground">
						{t(locale, 'home.preview.title')}
					</p>
				</div>
				<span
					class="rounded-pill border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-semibold text-accent"
					>{t(locale, 'home.preview.week')}</span
				>
			</div>

			<div class="grid grid-cols-3 gap-2.5 sm:gap-3">
				<div class="rounded-control border border-border/60 bg-surface-muted/60 p-3">
					<p class="text-2xl font-bold text-foreground">18</p>
					<p class="text-xs text-muted">{t(locale, 'home.preview.campaigns')}</p>
				</div>
				<div class="rounded-control border border-border/60 bg-surface-muted/60 p-3">
					<p class="text-2xl font-bold text-highlight">12</p>
					<p class="text-xs text-muted">{t(locale, 'home.preview.onTrack')}</p>
				</div>
				<div class="rounded-control border border-border/60 bg-surface-muted/60 p-3">
					<p class="text-2xl font-bold text-warning">03</p>
					<p class="text-xs text-muted">{t(locale, 'home.preview.toReview')}</p>
				</div>
			</div>

			<div class="rounded-control border border-border/60 bg-surface-muted/40 p-4">
				<div class="mb-4 flex items-center justify-between gap-3 text-xs">
					<span class="font-semibold text-foreground">{t(locale, 'home.preview.activity')}</span>
					<span class="text-muted">{t(locale, 'home.preview.weeks')}</span>
				</div>
				<div
					aria-hidden="true"
					class="flex h-28 items-end gap-1.5 border-b border-border/60 sm:h-32"
				>
					{#each bars as height, index (index)}
						<span
							class={`w-full rounded-t-[0.35rem] ${index === bars.length - 1 ? 'bg-highlight' : 'bg-accent/60'}`}
							style:height={`${height}%`}
						></span>
					{/each}
				</div>
			</div>

			<div
				class="flex items-center justify-between gap-4 rounded-control border border-border/60 bg-surface-muted/40 px-4 py-3"
			>
				<div class="min-w-0">
					<p class="truncate text-caption font-semibold text-foreground">
						{t(locale, 'home.preview.launch')}
					</p>
					<p class="text-xs text-muted">{t(locale, 'home.preview.milestone')}</p>
				</div>
				<Badge variant="accent">{t(locale, 'home.preview.scheduled')}</Badge>
			</div>
			<p class="text-right text-[0.7rem] text-muted">{t(locale, 'home.preview.note')}</p>
		</div>
	</Card>
</aside>
