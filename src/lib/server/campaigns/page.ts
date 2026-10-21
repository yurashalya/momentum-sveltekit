import { redirect } from '@sveltejs/kit';
import {
	parseCampaignListParams,
	serializeCampaignListParams
} from '#lib/features/campaigns/list-state.js';
import { queryCampaignPage } from '#lib/server/data/campaigns.js';

export const loadCampaignItems = (url: URL) => {
	const state = parseCampaignListParams(url.searchParams);
	const normalized = serializeCampaignListParams(state).toString();
	if (url.searchParams.toString() !== normalized) {
		redirect(307, `${url.pathname}${normalized ? `?${normalized}` : ''}`);
	}
	return { state, result: queryCampaignPage(state) };
};
