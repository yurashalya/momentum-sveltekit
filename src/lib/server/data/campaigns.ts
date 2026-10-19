import rawCampaigns from '../../../../mocks/items.json';
import {
	CAMPAIGN_PAGE_SIZE,
	CAMPAIGN_LIST_DEFAULTS,
	SORT_DIRECTION
} from '#lib/features/campaigns/constants.js';
import {
	campaignListParamsSchema,
	campaignsSchema,
	renameCampaignSchema
} from '#lib/features/campaigns/schema.js';
import type { Campaign, CampaignListParams } from '#lib/features/campaigns/schema.js';

const campaigns = campaignsSchema.parse(rawCampaigns);
const editedNames = new Map<string, string>();
export const pageSize = CAMPAIGN_PAGE_SIZE;

export const parseCampaignListParams = (params: URLSearchParams): CampaignListParams => {
	return campaignListParamsSchema.parse({
		q: params.get('q') ?? CAMPAIGN_LIST_DEFAULTS.QUERY,
		status: params.get('status') ?? CAMPAIGN_LIST_DEFAULTS.FILTER,
		channel: params.get('channel') ?? CAMPAIGN_LIST_DEFAULTS.FILTER,
		sort: params.get('sort') ?? CAMPAIGN_LIST_DEFAULTS.SORT,
		dir: params.get('dir') ?? CAMPAIGN_LIST_DEFAULTS.DIRECTION,
		page: params.get('page') ?? String(CAMPAIGN_LIST_DEFAULTS.PAGE)
	});
};

export const getCampaignPage = (params: CampaignListParams) => {
	const needle = params.q.toLowerCase();
	const matching = campaigns
		.map((campaign) => ({ ...campaign, name: editedNames.get(campaign.id) ?? campaign.name }))
		.filter(
			(campaign) =>
				(!needle || campaign.name.toLowerCase().includes(needle)) &&
				(params.status === CAMPAIGN_LIST_DEFAULTS.FILTER || campaign.status === params.status) &&
				(params.channel === CAMPAIGN_LIST_DEFAULTS.FILTER || campaign.channel === params.channel)
		);
	matching.sort((a, b) => {
		const left = a[params.sort];
		const right = b[params.sort];
		const comparison =
			typeof left === 'number' && typeof right === 'number'
				? left - right
				: String(left).localeCompare(String(right));
		return params.dir === SORT_DIRECTION.ASC ? comparison : -comparison;
	});
	const pageCount = Math.max(1, Math.ceil(matching.length / pageSize));
	const page = Math.min(params.page, pageCount);
	return {
		rows: matching.slice((page - 1) * pageSize, page * pageSize),
		total: matching.length,
		page,
		pageCount,
		pageSize
	};
};

export const renameCampaign = (input: unknown): Campaign => {
	const { id, name } = renameCampaignSchema.parse(input);
	const campaign = campaigns.find((row) => row.id === id);
	if (!campaign) throw new Error('Campaign not found');
	editedNames.set(id, name);
	return { ...campaign, name };
};
