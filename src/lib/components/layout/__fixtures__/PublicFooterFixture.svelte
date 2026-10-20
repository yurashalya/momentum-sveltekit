<script lang="ts">
	import LocaleProvider from '#lib/i18n/LocaleProvider.svelte';
	import type { Locale } from '#lib/i18n/index.js';
	import PublicFooter from '../PublicFooter.svelte';

	let { locale }: { locale: Locale } = $props();
</script>

<LocaleProvider {locale}><PublicFooter /></LocaleProvider>
