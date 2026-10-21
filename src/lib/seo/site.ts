import site from '../../../site.config.json';

export const SITE_ORIGIN = site.origin;

export const absoluteUrl = (path: string) => new URL(path, SITE_ORIGIN).href;

export const postImageUrl = (locale: string, slug: string) =>
	absoluteUrl(`/og/${locale}/${slug}.png`);
