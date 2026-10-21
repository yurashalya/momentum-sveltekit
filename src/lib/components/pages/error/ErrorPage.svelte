<script lang="ts">
	import { resolve } from '$app/paths';
	import PublicFooter from '#lib/components/layout/PublicFooter.svelte';
	import PublicHeader from '#lib/components/layout/PublicHeader.svelte';
	import ActionLink from '#lib/components/ui/ActionLink.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Container from '#lib/components/ui/Container.svelte';
	import Heading from '#lib/components/ui/Heading.svelte';
	import { useLocale } from '#lib/i18n/context.js';
	import { t } from '#lib/i18n/index.js';
	import { blogHref } from '#lib/i18n/hrefs.js';
	import { localeHomePath } from '#lib/i18n/paths.js';

	let { status }: { status: number } = $props();
	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
	let isNotFound = $derived(status === 404);
	let homeHref = $derived(resolve(localeHomePath(locale)));
	let seoTitle = $derived(
		t(locale, isNotFound ? 'error.notFound.seo.title' : 'error.unexpected.seo.title')
	);
	let eyebrow = $derived(
		t(locale, isNotFound ? 'error.notFound.eyebrow' : 'error.unexpected.eyebrow')
	);
	let title = $derived(t(locale, isNotFound ? 'error.notFound.title' : 'error.unexpected.title'));
	let description = $derived(
		t(locale, isNotFound ? 'error.notFound.description' : 'error.unexpected.description')
	);
</script>

<svelte:head>
	<title>{seoTitle}</title>
	<meta name="description" content={description} />
	<meta name="robots" content="noindex,follow" />
</svelte:head>

<div id="top" class="flex min-h-screen flex-col bg-canvas text-foreground">
	<PublicHeader />
	<main id="main" class="relative isolate flex flex-1 items-center overflow-hidden">
		<div aria-hidden="true" class="error-glow pointer-events-none absolute inset-0 -z-10"></div>
		<div aria-hidden="true" class="error-grid pointer-events-none absolute inset-0 -z-10"></div>
		<Container
			class="relative grid w-full items-center gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16 lg:py-28"
		>
			<div class="max-w-2xl">
				<Badge variant="accent">{eyebrow}</Badge>
				<Heading level={1} class="mt-6 max-w-[14ch]">{title}</Heading>
				<p class="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">{description}</p>
				<div class="mt-9 flex flex-wrap gap-3">
					<ActionLink href={homeHref}
						>{t(locale, 'error.home')} <span aria-hidden="true">↗</span></ActionLink
					>
					<ActionLink href={blogHref(locale)} variant="secondary"
						>{t(locale, 'error.blog')}</ActionLink
					>
				</div>
			</div>

			<div
				aria-hidden="true"
				class="error-art relative mx-auto flex w-full max-w-lg items-center justify-center overflow-hidden rounded-card border border-border/70 bg-panel shadow-card"
			>
				<div class="absolute inset-4 rounded-card border border-border/50"></div>
				<div
					class="absolute left-1/2 top-1/2 h-[82%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/25"
				></div>
				<div
					class="absolute left-1/2 top-1/2 h-[58%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border-strong/40"
				></div>
				<div class="absolute right-[17%] top-[18%] h-3 w-3 rounded-full bg-highlight"></div>
				<div class="absolute bottom-[19%] left-[17%] h-2 w-2 rounded-full bg-accent"></div>
				<span
					class="relative bg-gradient-to-br from-foreground via-accent to-highlight bg-clip-text text-[clamp(6rem,18vw,10rem)] font-black leading-none tracking-[-0.1em] text-transparent"
					>{status}</span
				>
				<div
					class="absolute bottom-7 left-7 flex items-center gap-2 text-[0.625rem] font-bold uppercase tracking-[0.25em] text-muted"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-highlight"></span>Momentum / {status}
				</div>
			</div>
		</Container>
	</main>
	<PublicFooter />
</div>

<style>
	.error-art {
		aspect-ratio: 1.15;
		min-height: 18rem;
	}

	.error-glow {
		background:
			radial-gradient(circle at 18% 24%, rgb(var(--color-accent) / 0.12), transparent 34%),
			radial-gradient(circle at 82% 62%, rgb(var(--color-highlight) / 0.07), transparent 36%);
	}

	.error-grid {
		background-image:
			linear-gradient(rgb(var(--color-border) / 0.12) 1px, transparent 1px),
			linear-gradient(90deg, rgb(var(--color-border) / 0.12) 1px, transparent 1px);
		background-size: 56px 56px;
		mask-image: linear-gradient(to bottom, rgb(0 0 0 / 0.45), transparent 88%);
	}
</style>
