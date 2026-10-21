import { defineConfig } from '@playwright/test';

export default defineConfig({
	use: { baseURL: 'http://127.0.0.1:4173' },
	webServer: {
		command: 'pnpm run build && pnpm run preview --host 127.0.0.1',
		url: 'http://127.0.0.1:4173',
		env: { SESSION_SECRET: 'playwright-test-secret-with-at-least-32-characters' },
		reuseExistingServer: !process.env.CI,
		timeout: 120_000
	},
	testMatch: '**/*.e2e.{ts,js}'
});
