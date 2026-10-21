import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const output = new URL('.vercel/output/', root);
const configFile = new URL('config.json', output);
const config = JSON.parse(await readFile(configFile, 'utf8'));
const functionDirectory = new URL('functions/api/locale-suggestion.func/', output);
await mkdir(functionDirectory, { recursive: true });
await copyFile(new URL('edge/locale-suggestion.js', root), new URL('index.js', functionDirectory));
await writeFile(
	new URL('.vc-config.json', functionDirectory),
	JSON.stringify({ runtime: 'edge', entrypoint: 'index.js' }, null, 2)
);

const route = { src: '^/api/locale-suggestion/?$', dest: '/api/locale-suggestion' };
if (!config.routes.some((item) => item.src === route.src)) {
	const filesystem = config.routes.findIndex((item) => item.handle === 'filesystem');
	if (filesystem < 0) throw new Error('Vercel output has no filesystem routing entry');
	config.routes.splice(filesystem, 0, route);
}
await writeFile(configFile, `${JSON.stringify(config, null, 2)}\n`);
console.log('Added /api/locale-suggestion as a Vercel Edge Function');
