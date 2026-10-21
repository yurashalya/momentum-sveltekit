import { json, type RequestHandler } from '@sveltejs/kit';
import { telemetrySchema } from '#lib/features/telemetry/schema.js';

export const POST: RequestHandler = async ({ request, url }) => {
	const origin = request.headers.get('origin');
	if (origin && origin !== url.origin) return json({ code: 'forbidden' }, { status: 403 });
	const contentType = request.headers.get('content-type') ?? '';
	if (!contentType.startsWith('application/json')) {
		return json({ code: 'invalid' }, { status: 415 });
	}
	if (Number(request.headers.get('content-length')) > 4096) {
		return json({ code: 'tooLarge' }, { status: 413 });
	}
	const body = await request.text();
	if (body.length > 4096) return json({ code: 'tooLarge' }, { status: 413 });
	let payload: unknown;
	try {
		payload = JSON.parse(body);
	} catch {
		return json({ code: 'invalid' }, { status: 400 });
	}
	const parsed = telemetrySchema.safeParse(payload);
	if (!parsed.success) return json({ code: 'invalid' }, { status: 400 });
	console.info('[telemetry]', JSON.stringify(parsed.data));
	return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
};
