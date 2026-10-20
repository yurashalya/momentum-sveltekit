import { defineParams } from '@sveltejs/kit/params';
import { z } from 'zod';

// Loaded directly by Node before SvelteKit resolves application aliases.
export const params = defineParams({ locale: z.enum(['en', 'de']) });
