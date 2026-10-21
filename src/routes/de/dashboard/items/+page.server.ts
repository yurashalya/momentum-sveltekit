import type { PageServerLoad } from './$types';
import { loadCampaignItems } from '#lib/server/campaigns/page.js';

export const load: PageServerLoad = ({ url }) => loadCampaignItems(url);
