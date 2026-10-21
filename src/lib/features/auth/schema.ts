import { z } from 'zod';
import { LOGIN_FIELD_MAX_LENGTH } from './constants.js';

export const loginSchema = z.object({
	email: z.string().trim().toLowerCase().max(LOGIN_FIELD_MAX_LENGTH.email).pipe(z.email()),
	password: z.string().min(1).max(LOGIN_FIELD_MAX_LENGTH.password).regex(/^\S+$/)
});
export type LoginInput = z.infer<typeof loginSchema>;

export const userSchema = z.object({
	id: z.string().min(1),
	email: z.email(),
	password: z.string().min(1),
	name: z.string().min(1),
	role: z.enum(['admin', 'editor', 'viewer'])
});
export const usersSchema = z.array(userSchema);
export type User = z.infer<typeof userSchema>;
export const publicUserSchema = userSchema.omit({ password: true });
export type PublicUser = z.infer<typeof publicUserSchema>;
