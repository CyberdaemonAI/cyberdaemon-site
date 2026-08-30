import { defineCollection, z } from 'astro:content';

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});

export const collections = {
  research:     defineCollection({ type: 'content', schema: articleSchema }),
  analysis:     defineCollection({ type: 'content', schema: articleSchema }),
  'build-logs': defineCollection({ type: 'content', schema: articleSchema }),
};
