<script lang="ts">
	import { resolve } from '$app/paths';
	import PublicFooter from '#lib/components/layout/PublicFooter.svelte';
	import PublicHeader from '#lib/components/layout/PublicHeader.svelte';
	import { useLocale } from '#lib/i18n/context.js';
	import { defaultLocale, LOCALE, t, type Locale } from '#lib/i18n/index.js';
	import { localeHomePath } from '#lib/i18n/paths.js';
	import { absoluteUrl } from '#lib/seo/site.js';
	import HomeCallout from './components/HomeCallout.svelte';
	import HomeFeatures from './components/HomeFeatures.svelte';
	import HomeHero from './components/HomeHero.svelte';
	import HomePricing from './components/HomePricing.svelte';
	import HomeStories from './components/HomeStories.svelte';

	const openGraphLocales = {
		[LOCALE.EN]: 'en_US',
		[LOCALE.DE]: 'de_DE'
	} as const satisfies Record<Locale, string>;

	const currentLocale = useLocale();
	let locale = $derived(currentLocale());
	let homeHref = $derived(absoluteUrl(resolve(localeHomePath(locale))));
</script>

<svelte:head>
	<title>{t(locale, 'home.seo.title')}</title>
	<meta name="description" content={t(locale, 'home.seo.description')} />
	<link rel="canonical" href={homeHref} />
	<link
		rel="alternate"
		hreflang={LOCALE.EN}
		href={absoluteUrl(resolve(localeHomePath(LOCALE.EN)))}
	/>
	<link
		rel="alternate"
		hreflang={LOCALE.DE}
		href={absoluteUrl(resolve(localeHomePath(LOCALE.DE)))}
	/>
	<link
		rel="alternate"
		hreflang="x-default"
		href={absoluteUrl(resolve(localeHomePath(defaultLocale)))}
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content={t(locale, 'home.seo.title')} />
	<meta property="og:description" content={t(locale, 'home.seo.description')} />
	<meta property="og:url" content={homeHref} />
	<meta property="og:image" content={absoluteUrl('/og/momentum.png')} />
	<meta property="og:locale" content={openGraphLocales[locale]} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={t(locale, 'home.seo.title')} />
	<meta name="twitter:description" content={t(locale, 'home.seo.description')} />
	<meta name="twitter:image" content={absoluteUrl('/og/momentum.png')} />
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Organization",
			"name": "Momentum"
		}
	</script>
</svelte:head>

<div id="top" class="overflow-hidden bg-canvas text-foreground">
	<PublicHeader />
	<main id="main">
		<HomeHero />
		<HomeFeatures />
		<HomePricing />
		<HomeStories />
		<HomeCallout />
	</main>
	<PublicFooter />
</div>
