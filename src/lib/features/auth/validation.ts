import type { z } from 'zod';

export type PasswordFieldError = 'required' | 'tooLong' | 'whitespace';
export type LoginFieldErrors = { email?: boolean; password?: PasswordFieldError };

export const loginFieldErrors = (issues: z.ZodIssue[]): LoginFieldErrors => {
	const passwordIssues = issues.filter((issue) => issue.path[0] === 'password');
	let password: PasswordFieldError | undefined;
	if (passwordIssues.some((issue) => issue.code === 'too_small')) password = 'required';
	else if (passwordIssues.some((issue) => issue.code === 'too_big')) password = 'tooLong';
	else if (passwordIssues.some((issue) => issue.code === 'invalid_format')) password = 'whitespace';
	else if (passwordIssues.length) password = 'required';

	return {
		email: issues.some((issue) => issue.path[0] === 'email') || undefined,
		password
	};
};
