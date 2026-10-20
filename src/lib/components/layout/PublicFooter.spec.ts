import { render } from 'svelte/server';
import { expect, it } from 'vitest';
import { LOCALE } from '#lib/i18n/index.js';
import PublicFooterFixture from './__fixtures__/PublicFooterFixture.svelte';

it('renders the footer links and copy in the selected language', () => {
	const { body } = render(PublicFooterFixture, { props: { locale: LOCALE.DE } });

	expect(body).toContain('Ein klarerer Weg, gute Arbeit voranzubringen.');
	expect(body).toContain('aria-label="Fußnavigation"');
	expect(body).toContain('href="/de#features"');
	expect(body).toContain('>Funktionen</a>');
	expect(body).toContain('>Preise</a>');
	expect(body).toContain('>Geschichten</a>');
	expect(body).toContain('href="/de#top"');
	expect(body).toContain('>Zurück nach oben ↑</a>');
});
