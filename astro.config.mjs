import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://cyberdaemon.ai',
  integrations: [
    tailwind({ configFile: './tailwind.config.mjs' }),
    mdx(),
  ],
});
