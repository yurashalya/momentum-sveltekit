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
