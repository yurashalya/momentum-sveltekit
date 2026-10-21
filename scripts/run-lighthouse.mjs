import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { randomBytes } from 'node:crypto';
import { once } from 'node:events';
import { chromium } from '@playwright/test';

const port = await new Promise((resolve, reject) => {
	const server = createServer();
	server.once('error', reject);
	server.listen(0, '127.0.0.1', () => {
		const address = server.address();
		server.close(() => resolve(address.port));
	});
});
const baseUrl = `http://127.0.0.1:${port}`;
const environment = {
	...process.env,
	SESSION_SECRET: randomBytes(32).toString('hex'),
	MOMENTUM_AUDIT_URL: baseUrl,
	CHROME_PATH: chromium.executablePath()
};
const server = spawn(
	process.execPath,
	[
		'node_modules/vite/bin/vite.js',
		'preview',
		'--host',
		'127.0.0.1',
		'--port',
		String(port),
		'--strictPort'
	],
	{
		env: environment,
		stdio: 'inherit',
		detached: true
	}
);

const run = async (args, extraEnvironment = {}) => {
	const child = spawn('pnpm', ['exec', 'lhci', ...args], {
		env: { ...environment, ...extraEnvironment },
		stdio: 'inherit'
	});
	const [code] = await once(child, 'exit');
	if (code !== 0) throw new Error(`lhci ${args[0]} exited with status ${code}`);
};

const waitForServer = async () => {
	for (let attempt = 0; attempt < 100; attempt += 1) {
		if (server.exitCode !== null) throw new Error('Preview server exited before becoming ready');
		try {
			const response = await fetch(baseUrl, { signal: AbortSignal.timeout(1000) });
			if (response.ok) return;
		} catch {
			// The preview server is still starting.
		}
		await new Promise((resolve) => setTimeout(resolve, 200));
	}
	throw new Error('Preview server did not become ready within 20 seconds');
};

try {
	await waitForServer();
	await run(['collect', '--config=.lighthouserc.cjs'], { MOMENTUM_AUDIT_SCOPE: 'public' });
	const login = await fetch(`${baseUrl}/login`, {
		method: 'POST',
		redirect: 'manual',
		headers: {
			Origin: baseUrl,
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'text/html'
		},
		body: new URLSearchParams({ email: 'viewer@demo.test', password: 'demo1234' })
	});
	const cookie = login.headers.get('set-cookie')?.split(';', 1)[0];
	if (login.status !== 303 || !cookie?.startsWith('momentum_session=')) {
		throw new Error(`Demo login failed with status ${login.status}`);
	}
	await run(['collect', '--config=.lighthouserc.cjs'], {
		MOMENTUM_AUDIT_SCOPE: 'dashboard',
		MOMENTUM_AUDIT_COOKIE: cookie
	});
	let assertionError;
	try {
		await run(['assert', '--config=.lighthouserc.cjs'], { MOMENTUM_AUDIT_SCOPE: 'public' });
	} catch (error) {
		assertionError = error;
	}
	await run(['upload', '--config=.lighthouserc.cjs'], { MOMENTUM_AUDIT_SCOPE: 'public' });
	if (assertionError) throw assertionError;
} finally {
	if (server.pid && server.exitCode === null) {
		try {
			process.kill(-server.pid, 'SIGTERM');
		} catch {
			server.kill('SIGTERM');
		}
	}
}
