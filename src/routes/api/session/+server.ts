import { json, type RequestHandler } from '@sveltejs/kit';

export const prerender = false;

export const GET: RequestHandler = ({ locals }) =>
	json(
		{
			user: locals.user ? { name: locals.user.name, role: locals.user.role } : null
		},
		{ headers: { 'cache-control': 'private, no-store', vary: 'Cookie' } }
	);
