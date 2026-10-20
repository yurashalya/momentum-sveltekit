import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { LOCALE } from '#lib/i18n/index.js';
import { localeBlogPath } from '#lib/i18n/paths.js';

export const prerender = true;
export const load: PageServerLoad = () => redirect(308, localeBlogPath(LOCALE.EN));
