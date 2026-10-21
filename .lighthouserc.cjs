const baseUrl = process.env.MOMENTUM_AUDIT_URL;
const target = process.env.MOMENTUM_AUDIT_SCOPE;

if (!baseUrl || !['public', 'dashboard'].includes(target)) {
	throw new Error('Run Lighthouse through pnpm check:lighthouse');
}

module.exports = {
	ci: {
		collect: {
			url:
				target === 'public'
					? [`${baseUrl}/`, `${baseUrl}/en/blog/sub-second-lcp-on-a-content-site`]
					: [`${baseUrl}/dashboard/items`],
			additive: target === 'dashboard',
			chromePath: process.env.CHROME_PATH,
			numberOfRuns: Number(process.env.MOMENTUM_AUDIT_RUNS || 3),
			settings: {
				// GitHub's Ubuntu runner does not expose a usable Chrome sandbox.
				...(process.env.CI === 'true' && process.platform === 'linux'
					? { chromeFlags: '--no-sandbox --disable-dev-shm-usage' }
					: {}),
				...(target === 'dashboard'
					? {
							extraHeaders: { Cookie: process.env.MOMENTUM_AUDIT_COOKIE },
							// A private dashboard intentionally has noindex; its other SEO audits still run.
							skipAudits: ['is-crawlable']
						}
					: {})
			}
		},
		assert: {
			aggregationMethod: 'median',
			assertions: {
				'categories:performance': ['error', { minScore: 0.95 }],
				'categories:accessibility': ['error', { minScore: 0.95 }],
				'categories:seo': ['error', { minScore: 0.95 }],
				'categories:best-practices': ['error', { minScore: 0.95 }],
				'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
				'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
				'total-blocking-time': ['error', { maxNumericValue: 200 }]
			}
		},
		upload: { target: 'filesystem', outputDir: '.lighthouseci/reports' }
	}
};
