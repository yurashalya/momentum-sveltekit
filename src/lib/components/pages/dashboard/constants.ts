import type { CampaignChannel, CampaignStatus } from '#lib/features/campaigns/schema.js';

export const campaignStatusLabelKeys = {
	draft: 'dashboard.status.draft',
	scheduled: 'dashboard.status.scheduled',
	active: 'dashboard.status.active',
	paused: 'dashboard.status.paused',
	completed: 'dashboard.status.completed',
	archived: 'dashboard.status.archived'
} as const satisfies Record<CampaignStatus, string>;

export const campaignChannelLabelKeys = {
	email: 'dashboard.channel.email',
	sms: 'dashboard.channel.sms',
	web: 'dashboard.channel.web',
	social: 'dashboard.channel.social',
	push: 'dashboard.channel.push'
} as const satisfies Record<CampaignChannel, string>;

export const campaignStatusVariants = {
	draft: 'neutral',
	scheduled: 'accent',
	active: 'success',
	paused: 'warning',
	completed: 'neutral',
	archived: 'danger'
} as const satisfies Record<
	CampaignStatus,
	'neutral' | 'accent' | 'success' | 'warning' | 'danger'
>;
