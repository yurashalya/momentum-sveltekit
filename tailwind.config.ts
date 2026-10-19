import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
				surface: 'rgb(var(--color-surface) / <alpha-value>)',
				foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
				muted: 'rgb(var(--color-muted) / <alpha-value>)',
				border: 'rgb(var(--color-border) / <alpha-value>)',
				accent: 'rgb(var(--color-accent) / <alpha-value>)',
				'accent-foreground': 'rgb(var(--color-accent-foreground) / <alpha-value>)'
			},
			spacing: {
				page: 'var(--space-page)',
				section: 'var(--space-section)'
			},
			borderRadius: {
				card: 'var(--radius-card)',
				control: 'var(--radius-control)'
			},
			fontFamily: {
				sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif']
			}
		}
	}
} satisfies Config;
