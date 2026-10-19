import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().trim().toLowerCase().pipe(z.email()),
	password: z.string().min(1)
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
