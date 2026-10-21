import { CAMPAIGN_LIST_DEFAULTS } from './constants.js';
import { campaignListParamsSchema, type CampaignListParams } from './schema.js';

export const parseCampaignListParams = (params: URLSearchParams): CampaignListParams =>
	campaignListParamsSchema.parse({
		q: params.get('q') ?? CAMPAIGN_LIST_DEFAULTS.QUERY,
		status: params.get('status') ?? CAMPAIGN_LIST_DEFAULTS.FILTER,
		channel: params.get('channel') ?? CAMPAIGN_LIST_DEFAULTS.FILTER,
		sort: params.get('sort') ?? CAMPAIGN_LIST_DEFAULTS.SORT,
		dir: params.get('dir') ?? CAMPAIGN_LIST_DEFAULTS.DIRECTION,
		page: params.get('page') ?? String(CAMPAIGN_LIST_DEFAULTS.PAGE)
	});

export const serializeCampaignListParams = (state: CampaignListParams): URLSearchParams => {
	const params = new URLSearchParams();
	if (state.q) params.set('q', state.q);
	if (state.status !== CAMPAIGN_LIST_DEFAULTS.FILTER) params.set('status', state.status);
	if (state.channel !== CAMPAIGN_LIST_DEFAULTS.FILTER) params.set('channel', state.channel);
	if (state.sort !== CAMPAIGN_LIST_DEFAULTS.SORT) params.set('sort', state.sort);
	if (state.dir !== CAMPAIGN_LIST_DEFAULTS.DIRECTION) params.set('dir', state.dir);
	if (state.page !== CAMPAIGN_LIST_DEFAULTS.PAGE) params.set('page', String(state.page));
	return params;
};
