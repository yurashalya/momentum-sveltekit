import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	SESSION_SECRET: {
		schema: (value) => value || undefined,
		description: 'At least 32 characters, required to sign production login sessions.'
	}
});
