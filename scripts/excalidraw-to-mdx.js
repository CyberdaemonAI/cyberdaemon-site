#!/usr/bin/env node
/**
 * Excalidraw -> SVG -> DiagramBlock MDX snippet
 *
 * Reads a .excalidraw file, renders it to SVG via excalirender, writes the SVG
 * to public/images/, and emits a ready-to-paste MDX snippet.
 *
 * Usage:
 *   node scripts/excalidraw-to-mdx.js <input.excalidraw> \
 *     [--slug article-slug] \
 *     [--descriptor flow] \
 *     [--caption "Optional caption"]
 *
 * Output:
 *   public/images/<slug>-<descriptor>.svg
 *   <slug>-<descriptor>.mdx.snippet  (printed to stdout and written next to input)
 *
 * Requires: npm install -D excalirender
 * See: docs/DIAGRAM-GUIDE.md — Tier 2 / Excalidraw CLI workflow
 */

import excalirender from 'excalirender';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, basename, extname, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve repo root (two levels up from scripts/)
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

// ── CLI arg parsing ────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log([
    'Usage:',
    '  node scripts/excalidraw-to-mdx.js <input.excalidraw> [options]',
    '',
    'Options:',
    '  --slug <slug>           Article slug used in the image filename (default: input basename)',
    '  --descriptor <desc>     Short descriptor appended to slug (default: diagram)',
    '  --caption <text>        Caption text for the DiagramBlock',
    '  --help                  Show this message',
    '',
    'Output:',
    '  public/images/<slug>-<descriptor>.svg',
    '  <slug>-<descriptor>.mdx.snippet  (next to input file)',
  ].join('\n'));
  process.exit(0);
}

const inputArg = args[0];

if (!inputArg || inputArg.startsWith('--')) {
  console.error('Error: first argument must be a path to a .excalidraw file.');
  process.exit(1);
}

if (!existsSync(inputArg)) {
  console.error(`Error: file not found: ${inputArg}`);
  process.exit(1);
}

if (extname(inputArg).toLowerCase() !== '.excalidraw') {
  console.error(`Error: expected a .excalidraw file, got: ${inputArg}`);
  process.exit(1);
}

// Parse flags
let slug = basename(inputArg, '.excalidraw');
let descriptor = 'diagram';
let caption = '';

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--slug' && args[i + 1]) { slug = args[++i]; }
  else if (args[i] === '--descriptor' && args[i + 1]) { descriptor = args[++i]; }
  else if (args[i] === '--caption' && args[i + 1]) { caption = args[++i]; }
}

// ── Paths ──────────────────────────────────────────────────────────────────────

const imageFilename = `${slug}-${descriptor}.svg`;
const imagesDir = join(REPO_ROOT, 'public', 'images');
const svgOutputPath = join(imagesDir, imageFilename);
const snippetPath = join(dirname(resolve(inputArg)), `${slug}-${descriptor}.mdx.snippet`);

// Ensure public/images/ exists
if (!existsSync(imagesDir)) {
  mkdirSync(imagesDir, { recursive: true });
  console.log(`Created: public/images/`);
}

// ── Render SVG ────────────────────────────────────────────────────────────────

console.log(`Rendering: ${inputArg}`);

try {
  await excalirender(inputArg, { output: svgOutputPath, sketch: true });
  console.log(`SVG written: public/images/${imageFilename}`);
} catch (err) {
  console.error(`Render failed: ${err.message}`);
  process.exit(1);
}

// ── Build MDX snippet ─────────────────────────────────────────────────────────

const captionAttr = caption ? ` caption="${caption}"` : '';

const mdxSnippet = [
  `import DiagramBlock from '@/components/DiagramBlock.astro';`,
  ``,
  `<DiagramBlock type="sketch" src="/images/${imageFilename}"${captionAttr} />`,
].join('\n');

writeFileSync(snippetPath, mdxSnippet, 'utf-8');

console.log(`Snippet written: ${snippetPath}`);
console.log('');
console.log('Paste into your article MDX:');
console.log('─'.repeat(60));
console.log(mdxSnippet);
console.log('─'.repeat(60));
console.log('');
console.log('After pasting:');
console.log(`  - Commit public/images/${imageFilename} with your article`);
console.log(`  - Delete the .excalidraw and .mdx.snippet files (do not commit them)`);
