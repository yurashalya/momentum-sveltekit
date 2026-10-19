import { z } from 'zod';

const translationSchema = z.object({
	title: z.string().min(1),
	excerpt: z.string().min(1),
	body: z.string().min(1)
});

export const postSchema = z.object({
	id: z.string().min(1),
	slug: z.string().min(1),
	translations: z.object({ en: translationSchema, de: translationSchema }),
	tags: z.array(z.string()),
	author: z.object({
		id: z.string().min(1),
		name: z.string().min(1),
		avatarColor: z.string().regex(/^#[0-9a-fA-F]{6}$/)
	}),
	publishedAt: z.string().datetime(),
	readingTimeMinutes: z.number().positive(),
	coverColor: z.string().regex(/^#[0-9a-fA-F]{6}$/)
});

export const postsSchema = z.array(postSchema);
export type Post = z.infer<typeof postSchema>;

export const tagSchema = z.object({
	slug: z.string().min(1),
	label: z.object({ en: z.string(), de: z.string() })
});
export const tagsSchema = z.array(tagSchema);
export type Tag = z.infer<typeof tagSchema>;
