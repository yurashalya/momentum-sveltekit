import type { Config } from 'tailwindcss';

const color = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				canvas: color('canvas'),
				surface: color('surface'),
				'surface-muted': color('surface-muted'),
				'surface-raised': color('surface-raised'),
				foreground: color('foreground'),
				muted: color('muted'),
				border: color('border'),
				'border-strong': color('border-strong'),
				accent: color('accent'),
				'accent-hover': color('accent-hover'),
				'accent-soft': color('accent-soft'),
				'accent-foreground': color('accent-foreground'),
				success: color('success'),
				'success-soft': color('success-soft'),
				warning: color('warning'),
				'warning-soft': color('warning-soft'),
				danger: color('danger'),
				'danger-hover': color('danger-hover'),
				'danger-soft': color('danger-soft'),
				'danger-foreground': color('danger-foreground'),
				focus: color('focus'),
				overlay: color('overlay')
			},
			spacing: {
				page: 'var(--space-page)',
				section: 'var(--space-section)',
				card: 'var(--space-card)',
				field: 'var(--space-field)'
			},
			maxWidth: {
				content: 'var(--width-content)'
			},
			borderRadius: {
				card: 'var(--radius-card)',
				control: 'var(--radius-control)',
				pill: 'var(--radius-pill)'
			},
			boxShadow: {
				card: 'var(--shadow-card)'
			},
			fontFamily: {
				sans: ['var(--font-sans)']
			},
			fontSize: {
				display: ['var(--font-size-display)', { lineHeight: 'var(--line-height-display)' }],
				heading: ['var(--font-size-heading)', { lineHeight: 'var(--line-height-heading)' }],
				subheading: [
					'var(--font-size-subheading)',
					{ lineHeight: 'var(--line-height-subheading)' }
				],
				body: ['var(--font-size-body)', { lineHeight: 'var(--line-height-body)' }],
				caption: ['var(--font-size-caption)', { lineHeight: 'var(--line-height-caption)' }]
			}
		}
	}
} satisfies Config;
