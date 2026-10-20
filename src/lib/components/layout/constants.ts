import type { TranslationKey } from '#lib/i18n/index.js';

type PublicLink = {
	href: `#${string}`;
	labelKey: TranslationKey;
};

export const publicSectionLinks = [
	{ href: '#features', labelKey: 'nav.features' },
	{ href: '#pricing', labelKey: 'nav.pricing' },
	{ href: '#stories', labelKey: 'nav.stories' }
] as const satisfies readonly PublicLink[];

export const footerLinks = [
	...publicSectionLinks,
	{ href: '#top', labelKey: 'nav.backToTop' }
] as const satisfies readonly PublicLink[];
