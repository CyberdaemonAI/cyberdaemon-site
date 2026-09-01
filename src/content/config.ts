import { defineCollection, z } from 'astro:content';

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  topic: z.string().optional(),
  // Manifesto cross-linking. Values: agents-as-people | intent-consent | small-vs-large
  // Add more as manifesto threads expand. Used by /manifesto to surface related articles.
  threads: z.array(z.string()).default([]),
  // If this article deprecates or updates a prior position, link the slug here.
  updates: z.string().optional(),
});

export const collections = {
  research:     defineCollection({ type: 'content', schema: articleSchema }),
  analysis:     defineCollection({ type: 'content', schema: articleSchema }),
  'build-logs': defineCollection({ type: 'content', schema: articleSchema }),
};
