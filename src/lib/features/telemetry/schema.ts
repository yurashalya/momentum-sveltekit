import { z } from 'zod';

const path = z.string().startsWith('/').max(240);

export const telemetrySchema = z.discriminatedUnion('kind', [
	z.object({
		kind: z.literal('vital'),
		name: z.enum(['LCP', 'INP', 'CLS', 'TTFB']),
		id: z.string().min(1).max(120),
		value: z.number().finite().nonnegative(),
		rating: z.enum(['good', 'needs-improvement', 'poor']),
		path
	}),
	z.object({
		kind: z.literal('error'),
		name: z.string().min(1).max(80),
		message: z.string().max(240),
		source: z.enum(['boundary', 'navigation', 'window', 'promise']),
		path
	})
]);
