import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

const root = new URL('../', import.meta.url);
const readJson = async (path) => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const site = await readJson('site.config.json');
const posts = await readJson('mocks/posts.json');
const origin = new URL(site.origin).origin;
const locales = Object.keys(posts[0].translations);
const escapeXml = (value) =>
	String(value).replace(
		/[&<>"']/g,
		(character) =>
			({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]
	);
const absolute = (path) => new URL(path, origin).href;

const urlEntry = (paths, lastmod) =>
	paths
		.map((path) => {
			const alternates = locales
				.map(
					(locale, index) =>
						`    <xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(absolute(paths[index]))}" />`
				)
				.join('\n');
			return `  <url>\n    <loc>${escapeXml(absolute(path))}</loc>\n${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(absolute(paths[0]))}" />${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`;
		})
		.join('\n');

const groups = [{ paths: locales.map((locale) => (locale === 'en' ? '/' : `/${locale}`)) }];
for (let page = 1; page <= Math.ceil(posts.length / site.blogPageSize); page += 1) {
	groups.push({
		paths: locales.map((locale) => `/${locale}/blog${page === 1 ? '' : `/page/${page}`}`)
	});
}
for (const post of posts) {
	groups.push({
		paths: locales.map((locale) => `/${locale}/blog/${post.slug}`),
		lastmod: post.publishedAt.slice(0, 10)
	});
}
const entries = groups.map(({ paths, lastmod }) => urlEntry(paths, lastmod));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
await writeFile(new URL('static/sitemap.xml', root), sitemap);
await writeFile(
	new URL('static/robots.txt', root),
	`User-agent: *\nDisallow: /dashboard\nDisallow: /de/dashboard\nDisallow: /login\nDisallow: /de/login\nSitemap: ${absolute('/sitemap.xml')}\n`
);

const lines = (title, max = 28) => {
	const result = [''];
	for (const word of title.split(/\s+/)) {
		const last = result.length - 1;
		if (`${result[last]} ${word}`.trim().length > max && result[last]) result.push(word);
		else result[last] = `${result[last]} ${word}`.trim();
	}
	return result.slice(0, 3);
};
const renderCard = (title, eyebrow, color) => {
	const titleLines = lines(title)
		.map(
			(line, index) =>
				`<text x="88" y="${230 + index * 92}" fill="#ffffff" font-size="70" font-weight="700" font-family="Arial, sans-serif">${escapeXml(line)}</text>`
		)
		.join('');
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="#080a11"/></linearGradient></defs><rect width="1200" height="630" fill="url(#bg)"/><circle cx="1050" cy="100" r="320" fill="#ffffff" opacity=".06"/><rect x="88" y="72" width="1024" height="486" rx="40" fill="#ffffff" opacity=".06"/><text x="88" y="135" fill="#c4b5fd" font-size="28" font-weight="700" font-family="Arial, sans-serif" letter-spacing="4">${escapeXml(eyebrow)}</text>${titleLines}<text x="88" y="538" fill="#d5d9e7" font-size="29" font-family="Arial, sans-serif">MOMENTUM  /  BLOG</text></svg>`;
	return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
};
const ogDirectory = new URL('static/og/', root);
await mkdir(ogDirectory, { recursive: true });
await writeFile(
	new URL('momentum.png', ogDirectory),
	renderCard('A clearer way to keep campaigns moving', 'MOMENTUM', '#5b3bd9')
);
for (const locale of locales) {
	const directory = new URL(`${locale}/`, ogDirectory);
	await mkdir(directory, { recursive: true });
	for (const post of posts) {
		if (!/^[a-z0-9-]+$/.test(post.slug)) throw new Error(`Invalid post slug: ${post.slug}`);
		await writeFile(
			new URL(`${post.slug}.png`, directory),
			renderCard(post.translations[locale].title, locale.toUpperCase(), post.coverColor)
		);
	}
}
console.log(`Generated sitemap, robots.txt and ${posts.length * locales.length + 1} OG images`);
