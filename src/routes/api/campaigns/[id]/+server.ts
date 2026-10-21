import { json, type RequestHandler } from '@sveltejs/kit';
import { renameCampaignSchema } from '#lib/features/campaigns/schema.js';
import { getCampaign, renameCampaign } from '#lib/server/data/campaigns.js';

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	if (!locals.user) return json({ code: 'unauthorized' }, { status: 401 });
	if (locals.user.role === 'viewer') return json({ code: 'forbidden' }, { status: 403 });

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ code: 'invalid' }, { status: 422 });
	}
	const parsed = renameCampaignSchema.safeParse({
		id: params.id,
		name: typeof body === 'object' && body !== null && 'name' in body ? body.name : undefined
	});
	if (!parsed.success) return json({ code: 'invalid' }, { status: 422 });
	const campaign = getCampaign(parsed.data.id);
	if (!campaign) return json({ code: 'notFound' }, { status: 404 });

	// The local mock API has a short response time so the optimistic state is observable.
	await new Promise((resolve) => setTimeout(resolve, 350));
	if (campaign.status === 'archived') return json({ code: 'archived' }, { status: 409 });
	try {
		return json({ campaign: renameCampaign(parsed.data) });
	} catch {
		return json({ code: 'unexpected' }, { status: 500 });
	}
};
