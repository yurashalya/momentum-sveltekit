import { describe, expect, it } from 'vitest';
import { createSessionToken, SESSION_TTL_SECONDS, verifySessionToken } from './token.js';

const secret = 'a'.repeat(32);
const now = 1_800_000_000_000;

describe('signed session tokens', () => {
	it('accepts a valid token until its expiry', () => {
		const token = createSessionToken('demo_editor', secret, now);
		expect(verifySessionToken(token, secret, now)).toBe('demo_editor');
		expect(verifySessionToken(token, secret, now + SESSION_TTL_SECONDS * 1000)).toBeUndefined();
	});

	it('rejects tampering, another signing key, and malformed values', () => {
		const token = createSessionToken('demo_editor', secret, now);
		const [payload, signature] = token.split('.');
		const changedPayload = Buffer.from(
			JSON.stringify({ userId: 'demo_admin', expiresAt: now + SESSION_TTL_SECONDS * 1000 })
		).toString('base64url');
		expect(verifySessionToken(`${changedPayload}.${signature}`, secret, now)).toBeUndefined();
		expect(verifySessionToken(`${payload}.${signature}`, 'b'.repeat(32), now)).toBeUndefined();
		expect(verifySessionToken('not-a-session', secret, now)).toBeUndefined();
	});
});
