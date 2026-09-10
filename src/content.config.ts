import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  excerpt: z.string().optional(),
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
  research:     defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/research' }),   schema: articleSchema }),
  analysis:     defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/analysis' }),   schema: articleSchema }),
  'build-logs': defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/build-logs' }), schema: articleSchema }),
};
