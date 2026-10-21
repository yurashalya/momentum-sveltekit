import type { HandleClientError } from '@sveltejs/kit/hooks';
import { reportClientError } from '#lib/telemetry/client.js';

export const handleError: HandleClientError = ({ kind, error }) => {
	if (kind === 'unknown') {
		reportClientError(error, 'navigation');
		return { message: 'Something went wrong' };
	}
};
