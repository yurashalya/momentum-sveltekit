import { randomBytes } from 'node:crypto';
import { SESSION_SECRET } from '$app/env/private';
import type { Cookies } from '@sveltejs/kit';
import type { PublicUser } from '#lib/features/auth/schema.js';
import { getUser } from '#lib/server/data/users.js';
import { createSessionToken, SESSION_TTL_SECONDS, verifySessionToken } from './token.js';

const SESSION_COOKIE = 'momentum_session';
let developmentSecret: string | undefined;

const getSessionSecret = () => {
	if (SESSION_SECRET) {
		if (SESSION_SECRET.length < 32)
			throw new Error('SESSION_SECRET must contain at least 32 characters');
		return SESSION_SECRET;
	}
	if (import.meta.env.DEV) return (developmentSecret ??= randomBytes(32).toString('hex'));
	throw new Error('SESSION_SECRET must be set in production');
};

export const setSession = (cookies: Cookies, userId: string, secure: boolean) => {
	cookies.set(SESSION_COOKIE, createSessionToken(userId, getSessionSecret()), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure,
		maxAge: SESSION_TTL_SECONDS
	});
};

export const getSessionUser = (cookies: Cookies): PublicUser | undefined => {
	const token = cookies.get(SESSION_COOKIE);
	if (!token) return undefined;
	const userId = verifySessionToken(token, getSessionSecret());
	if (!userId) return undefined;
	return getUser(userId);
};

export const clearSession = (cookies: Cookies) => {
	cookies.delete(SESSION_COOKIE, { path: '/' });
};
