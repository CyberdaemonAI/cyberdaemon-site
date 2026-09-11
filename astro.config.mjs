import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://cyberdaemon.ai',
  // Hybrid output: all pages static-prerendered except routes that opt out.
  // The /api/og.png endpoint exports `prerender = false` to run as a Vercel edge function.
  output: 'static',
  adapter: vercel(),
  integrations: [
    tailwind({ configFile: './tailwind.config.mjs' }),
    mdx(),
    sitemap(),
  ],
});
