import rawUsers from '../../../../mocks/users.json';
import { publicUserSchema, usersSchema } from '#lib/features/auth/schema.js';
import type { PublicUser } from '#lib/features/auth/schema.js';

const users = usersSchema.parse(rawUsers);

export const authenticate = (email: string, password: string): PublicUser | undefined => {
	const user = users.find((entry) => entry.email === email && entry.password === password);
	if (!user) return undefined;
	return publicUserSchema.parse(user);
};

export const getUser = (id: string): PublicUser | undefined => {
	const user = users.find((entry) => entry.id === id);
	if (!user) return undefined;
	return publicUserSchema.parse(user);
};
