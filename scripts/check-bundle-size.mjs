import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const output = new URL('../.svelte-kit/output/client/', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('.vite/manifest.json', output), 'utf8'));
const appSource = await readFile(
	new URL('../.svelte-kit/generated/build/client-optimized/app.js', import.meta.url),
	'utf8'
);

const routes = [
	{ id: '/', limit: 80 },
	{ id: '/de', limit: 80 },
	{ id: '/[locale=locale]/blog', limit: 80 },
	{ id: '/[locale=locale]/blog/page/[page]', limit: 80 },
	{ id: '/[locale=locale]/blog/[slug]', limit: 80 },
	{ id: '/search', limit: 80 },
	{ id: '/de/search', limit: 80 },
	{ id: '/login', limit: 80 },
	{ id: '/de/login', limit: 80 },
	{ id: '/dashboard', limit: 150 },
	{ id: '/dashboard/items', limit: 150 },
	{ id: '/de/dashboard', limit: 150 },
	{ id: '/de/dashboard/items', limit: 150 }
];

const findKey = (suffix) => {
	const key = Object.keys(manifest).find((candidate) => candidate.endsWith(suffix));
	if (!key) throw new Error(`Missing Vite manifest entry: ${suffix}`);
	return key;
};

const entryKeys = ['start', 'app'].map((name) => {
	const key = Object.keys(manifest).find((candidate) =>
		manifest[candidate].file?.startsWith(`_app/immutable/entry/${name}.`)
	);
	if (!key) throw new Error(`Missing client entry: ${name}`);
	return key;
});
const rootNodeKey = findKey('/nodes/0.js');
const routeNodes = (id) => {
	const line = appSource
		.split('\n')
		.find((candidate) => candidate.includes(`${JSON.stringify(id)}:`));
	if (!line) throw new Error(`Missing SvelteKit route dictionary entry: ${id}`);
	const nodes = [...line.matchAll(/~?(\d+)/g)].map((match) => Number(match[1]));
	if (nodes.length === 0) throw new Error(`No client nodes found for ${id}`);
	return nodes.map((node) => findKey(`/nodes/${node}.js`));
};

const initialFiles = (id) => {
	const files = new Set();
	const visit = (key, includeDynamic = false) => {
		const entry = manifest[key];
		if (!entry) throw new Error(`Missing dependency in Vite manifest: ${key}`);
		if (files.has(entry.file)) return;
		files.add(entry.file);
		for (const dependency of entry.imports ?? []) visit(dependency);
		if (includeDynamic) {
			for (const dependency of entry.dynamicImports ?? []) visit(dependency, true);
		}
	};
	for (const key of [...entryKeys, rootNodeKey, ...routeNodes(id)]) visit(key);
	// Root telemetry loads after hydration; include its sampled web-vitals import as a worst case.
	for (const key of manifest[rootNodeKey].dynamicImports ?? []) visit(key, true);
	return files;
};

let failed = false;
for (const { id, limit } of routes) {
	let bytes = 0;
	for (const file of initialFiles(id)) {
		bytes += gzipSync(await readFile(new URL(file, output))).byteLength;
	}
	const kib = bytes / 1024;
	const passed = kib <= limit;
	console.log(`${passed ? 'PASS' : 'FAIL'} ${id}: ${kib.toFixed(1)} KiB gzip / ${limit} KiB`);
	failed ||= !passed;
}

if (failed) process.exitCode = 1;
