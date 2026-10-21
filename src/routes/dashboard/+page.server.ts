import type { PageServerLoad } from './$types';
import { getCampaignOverview } from '#lib/server/data/campaigns.js';

export const load: PageServerLoad = () => ({ overview: getCampaignOverview() });
