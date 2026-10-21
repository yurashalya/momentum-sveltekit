import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';

const sessionPayloadSchema = z.object({
	userId: z.string().min(1),
	expiresAt: z.number().int().positive()
});

export const SESSION_TTL_SECONDS = 60 * 60 * 12;

export const createSessionToken = (userId: string, secret: string, now = Date.now()) => {
	const payload = Buffer.from(
		JSON.stringify({ userId, expiresAt: now + SESSION_TTL_SECONDS * 1000 })
	).toString('base64url');
	const signature = createHmac('sha256', secret).update(payload).digest('base64url');
	return `${payload}.${signature}`;
};

export const verifySessionToken = (token: string, secret: string, now = Date.now()) => {
	if (token.length > 2048) return undefined;
	const parts = token.split('.');
	if (parts.length !== 2) return undefined;
	const [payload, signature] = parts;
	const expected = createHmac('sha256', secret).update(payload).digest();
	const received = Buffer.from(signature, 'base64url');
	if (received.length !== expected.length || !timingSafeEqual(received, expected)) return undefined;

	try {
		const parsed = sessionPayloadSchema.safeParse(
			JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
		);
		return parsed.success && parsed.data.expiresAt > now ? parsed.data.userId : undefined;
	} catch {
		return undefined;
	}
};
