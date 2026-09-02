import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { createMermaidRenderer } from 'mermaid-isomorphic';
import { visit } from 'unist-util-visit';

const mermaidConfig = {
  theme: 'base',
  themeVariables: {
    background: '#16150f',
    primaryColor: '#1a1917',
    primaryTextColor: '#e6e4e0',
    primaryBorderColor: '#2e2c29',
    lineColor: '#b0ada6',
    secondaryColor: '#1e1d18',
    tertiaryColor: '#1e1d18',
    edgeLabelBackground: '#16150f',
    clusterBkg: '#1a1917',
    clusterBorder: '#2e2c29',
    titleColor: '#e6e4e0',
    nodeTextColor: '#e6e4e0',
    attributeBackgroundColorEven: '#1a1917',
    attributeBackgroundColorOdd: '#1e1d18',
    fontFamily: 'arial,sans-serif',
    fontSize: '13px',
  },
};

// Create one renderer per build -- shared browser session across all files.
const mermaidRenderer = createMermaidRenderer();

function remarkMermaid() {
  return async function transformer(tree) {
    const mermaidNodes = [];

    visit(tree, 'code', (node) => {
      if (node.lang === 'mermaid') {
        mermaidNodes.push(node);
      }
    });

    if (mermaidNodes.length === 0) return;

    const results = await mermaidRenderer(
      mermaidNodes.map((n) => n.value),
      { mermaidConfig },
    );

    for (let i = 0; i < mermaidNodes.length; i++) {
      const node = mermaidNodes[i];
      const result = results[i];
      if (result.status === 'fulfilled') {
        node.type = 'html';
        node.value = result.value.svg;
        delete node.lang;
        delete node.meta;
      } else {
        // Fail the build on mermaid syntax errors -- CI gate.
        const reason = result.reason?.message ?? String(result.reason);
        const preview = node.value?.split('\n').slice(0, 3).join(' ');
        throw new Error(`[remark-mermaid] Diagram render failed: ${reason}\nDiagram (first 3 lines): ${preview}`);
      }
    }
  };
}

export default defineConfig({
  site: 'https://cyberdaemon.ai',
  integrations: [
    tailwind({ configFile: './tailwind.config.mjs' }),
    mdx(),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkMermaid],
  },
});
