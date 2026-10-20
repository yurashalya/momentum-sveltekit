import type { LayoutLoad } from './$types';
import { localeFromPath } from '#lib/i18n/paths.js';

export const load: LayoutLoad = ({ url }) => ({ locale: localeFromPath(url.pathname) });
