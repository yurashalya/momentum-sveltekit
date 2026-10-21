import { z } from 'zod';
import { CAMPAIGN_LIST_DEFAULTS, CAMPAIGN_SORT, SORT_DIRECTION } from './constants.js';

export const campaignStatusSchema = z.enum([
	'draft',
	'scheduled',
	'active',
	'paused',
	'completed',
	'archived'
]);
export const campaignChannelSchema = z.enum(['email', 'sms', 'web', 'social', 'push']);

export const campaignSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	status: campaignStatusSchema,
	channel: campaignChannelSchema,
	owner: z.object({ id: z.string().min(1), name: z.string().min(1) }),
	budget: z.number().nonnegative(),
	spent: z.number().nonnegative(),
	impressions: z.number().int().nonnegative(),
	clicks: z.number().int().nonnegative(),
	ctr: z.number().min(0).max(1),
	startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	updatedAt: z.string().datetime(),
	tags: z.array(z.string())
});

export const campaignsSchema = z.array(campaignSchema);
export type Campaign = z.infer<typeof campaignSchema>;
export type CampaignStatus = z.infer<typeof campaignStatusSchema>;
export type CampaignChannel = z.infer<typeof campaignChannelSchema>;

export const campaignPageSchema = z.object({
	rows: campaignsSchema,
	total: z.number().int().nonnegative(),
	page: z.number().int().positive(),
	pageCount: z.number().int().positive(),
	pageSize: z.number().int().positive()
});
export type CampaignPage = z.infer<typeof campaignPageSchema>;

export const campaignOverviewSchema = z.object({
	total: z.number().int().nonnegative(),
	active: z.number().int().nonnegative(),
	scheduled: z.number().int().nonnegative(),
	budget: z.number().nonnegative(),
	recent: campaignsSchema
});
export type CampaignOverview = z.infer<typeof campaignOverviewSchema>;

export const renameCampaignSchema = z.object({
	id: z.string().min(1),
	name: z.string().trim().min(3).max(80)
});
export type RenameCampaign = z.infer<typeof renameCampaignSchema>;

export const campaignListParamsSchema = z.object({
	q: z.string().trim().max(100).catch(CAMPAIGN_LIST_DEFAULTS.QUERY),
	status: campaignStatusSchema
		.or(z.literal(CAMPAIGN_LIST_DEFAULTS.FILTER))
		.catch(CAMPAIGN_LIST_DEFAULTS.FILTER),
	channel: campaignChannelSchema
		.or(z.literal(CAMPAIGN_LIST_DEFAULTS.FILTER))
		.catch(CAMPAIGN_LIST_DEFAULTS.FILTER),
	sort: z.enum(CAMPAIGN_SORT).catch(CAMPAIGN_LIST_DEFAULTS.SORT),
	dir: z.enum(SORT_DIRECTION).catch(CAMPAIGN_LIST_DEFAULTS.DIRECTION),
	page: z.coerce.number().int().min(CAMPAIGN_LIST_DEFAULTS.PAGE).catch(CAMPAIGN_LIST_DEFAULTS.PAGE)
});
export type CampaignListParams = z.infer<typeof campaignListParamsSchema>;

export const campaignMutationErrorSchema = z.object({
	code: z.enum(['invalid', 'unauthorized', 'forbidden', 'notFound', 'archived', 'unexpected'])
});
export type CampaignMutationError = z.infer<typeof campaignMutationErrorSchema>;
export const campaignMutationSuccessSchema = z.object({ campaign: campaignSchema });
