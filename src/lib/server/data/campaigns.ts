import rawCampaigns from '../../../../mocks/items.json';
import {
	CAMPAIGN_PAGE_SIZE,
	CAMPAIGN_LIST_DEFAULTS,
	SORT_DIRECTION
} from '#lib/features/campaigns/constants.js';
import {
	campaignOverviewSchema,
	campaignsSchema,
	renameCampaignSchema
} from '#lib/features/campaigns/schema.js';
import { parseCampaignListParams } from '#lib/features/campaigns/list-state.js';
import type { Campaign, CampaignListParams, CampaignPage } from '#lib/features/campaigns/schema.js';

const campaigns = campaignsSchema.parse(rawCampaigns);
const editedNames = new Map<string, string>();
export const pageSize = CAMPAIGN_PAGE_SIZE;

export { parseCampaignListParams };

export const getCampaignPage = (params: CampaignListParams): CampaignPage => {
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

export const getCampaignOverview = () => {
	const recent = [...campaigns]
		.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
		.slice(0, 4)
		.map((campaign) => ({ ...campaign, name: editedNames.get(campaign.id) ?? campaign.name }));
	return campaignOverviewSchema.parse({
		total: campaigns.length,
		active: campaigns.filter((campaign) => campaign.status === 'active').length,
		scheduled: campaigns.filter((campaign) => campaign.status === 'scheduled').length,
		budget: campaigns.reduce((total, campaign) => total + campaign.budget, 0),
		recent
	});
};

export const queryCampaignPage = async (params: CampaignListParams): Promise<CampaignPage> => {
	await new Promise((resolve) => setTimeout(resolve, 160));
	return getCampaignPage(params);
};

export const getCampaign = (id: string): Campaign | undefined => {
	const campaign = campaigns.find((row) => row.id === id);
	return campaign ? { ...campaign, name: editedNames.get(id) ?? campaign.name } : undefined;
};

export const renameCampaign = (input: unknown): Campaign => {
	const { id, name } = renameCampaignSchema.parse(input);
	const campaign = campaigns.find((row) => row.id === id);
	if (!campaign) throw new Error('Campaign not found');
	if (campaign.status === 'archived') throw new Error('Archived campaign cannot be renamed');
	editedNames.set(id, name);
	return { ...campaign, name };
};
