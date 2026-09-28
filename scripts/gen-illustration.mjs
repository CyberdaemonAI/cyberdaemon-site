#!/usr/bin/env node
// Usage: node scripts/gen-illustration.mjs --slug <article-slug> [--prompt <override>]
// Requires: VAULT_ADDR and VAULT_TOKEN in environment or .env.local
// OpenAI key read from Vault at shared/openai.api_key (KV v1)
// Saves hero image to public/images/articles/<slug>/hero.jpg

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = resolve(__dirname, '..');

// Load .env.local if present (dev convenience; never commit this file)
const envLocalPath = resolve(SITE_ROOT, '.env.local');
if (existsSync(envLocalPath)) {
  for (const line of readFileSync(envLocalPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

// Parse CLI args
const args = process.argv.slice(2);
let slug = null;
let promptOverride = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--slug' && args[i + 1]) { slug = args[++i]; continue; }
  if (args[i] === '--prompt' && args[i + 1]) { promptOverride = args[++i]; continue; }
}

if (!slug) {
  console.error('Usage: node scripts/gen-illustration.mjs --slug <article-slug> [--prompt <override>]');
  process.exit(1);
}

// When Vault uses a self-signed cert (local dev), set VAULT_SKIP_VERIFY=true.
// Must be set before any TLS connection, so we set it here at module load.
if (process.env.VAULT_SKIP_VERIFY === 'true' || process.env.VAULT_SKIP_VERIFY === '1') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const VAULT_ADDR = process.env.VAULT_ADDR;
const VAULT_TOKEN = process.env.VAULT_TOKEN;
if (!VAULT_ADDR || !VAULT_TOKEN) {
  console.error('VAULT_TOKEN or VAULT_ADDR not set. Run: vault login && export VAULT_TOKEN=$(vault print token)');
  process.exit(1);
}

// Find article MDX across content lanes
const LANES = ['research', 'analysis', 'build-logs'];
let mdxPath = null;
for (const lane of LANES) {
  for (const ext of ['mdx', 'md']) {
    const candidate = resolve(SITE_ROOT, 'src', 'content', lane, `${slug}.${ext}`);
    if (existsSync(candidate)) { mdxPath = candidate; break; }
  }
  if (mdxPath) break;
}
if (!mdxPath) {
  console.error(`Article not found: ${slug}`);
  console.error(`Searched: ${LANES.map(l => `src/content/${l}/${slug}.{mdx,md}`).join(', ')}`);
  process.exit(1);
}

// Read secret from Vault KV v1 path
async function vaultGet(path) {
  const url = `${VAULT_ADDR}/v1/${path}`;
  const res = await fetch(url, { headers: { 'X-Vault-Token': VAULT_TOKEN } });
  if (!res.ok) {
    throw new Error(`Vault GET /${path} failed: HTTP ${res.status} — ${await res.text()}`);
  }
  const json = await res.json();
  const data = json.data;
  // KV v1 returns { data: { value: "..." } } or { data: { api_key: "..." } }
  if (typeof data === 'string') return data;
  if (data?.value) return data.value;
  if (data?.api_key) return data.api_key;
  // Return first string value found in data object
  for (const v of Object.values(data ?? {})) {
    if (typeof v === 'string' && v.length > 8) return v;
  }
  throw new Error(`Vault GET /${path}: cannot extract key from response shape: ${JSON.stringify(Object.keys(data ?? {}))}`);
}

// Extract title from MDX frontmatter
function extractTitle(content) {
  const m = content.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  return m ? m[1] : slug;
}

// Extract visual metaphor via Claude Haiku (Anthropic API direct)
async function extractMetaphor(content, title, anthropicKey) {
  // Skip import lines, JSX tags, frontmatter to get prose text
  const prose = content
    .split('\n')
    .filter(l => !l.startsWith('import ') && !l.startsWith('<') && l.trim() !== '---')
    .join('\n');
  const excerpt = prose.split('\n').filter(l => l.trim()).slice(0, 25).join('\n');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: `Article title: "${title}"\n\nOpening content:\n${excerpt}\n\nExtract a single visual metaphor for a DALL-E 3 illustration from this article. Return subject, style, and composition in one sentence suitable as a DALL-E prompt. No preamble — just the sentence.`,
      }],
    }),
  });
  if (!res.ok) throw new Error(`Claude Haiku error: HTTP ${res.status} — ${await res.text()}`);
  const json = await res.json();
  return json.content[0].text.trim();
}

async function main() {
  const content = readFileSync(mdxPath, 'utf8');
  const title = extractTitle(content);
  console.log(`Article: "${title}" (${mdxPath.replace(SITE_ROOT + '/', '')})`);

  let dallePrompt;
  if (promptOverride) {
    dallePrompt = promptOverride;
    console.log(`Using --prompt override.`);
  } else {
    console.log(`Extracting visual metaphor via Claude Haiku...`);
    let anthropicKey;
    try {
      anthropicKey = await vaultGet('shared/anthropic.api_key');
    } catch {
      // Fallback: ANTHROPIC_API_KEY env var (dev convenience only)
      anthropicKey = process.env.ANTHROPIC_API_KEY;
      if (!anthropicKey) throw new Error('Anthropic key not found in Vault (shared/anthropic.api_key) and ANTHROPIC_API_KEY not set');
    }
    const metaphor = await extractMetaphor(content, title, anthropicKey);
    console.log(`Metaphor: ${metaphor}`);
    dallePrompt = `Digital illustration, ${metaphor}, dark academic aesthetic, deep navy and amber tones, detailed, no text`;
  }
  console.log(`DALL-E 3 prompt: ${dallePrompt}`);

  console.log('Reading OpenAI key from Vault (shared/openai.api_key)...');
  const openaiKey = await vaultGet('shared/openai.api_key');

  console.log('Calling DALL-E 3 (HD, 1024x1792)...');
  const genRes = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: dallePrompt,
      quality: 'hd',
      size: '1024x1792',
      n: 1,
    }),
  });
  if (!genRes.ok) throw new Error(`DALL-E 3 error: HTTP ${genRes.status} — ${await genRes.text()}`);
  const genJson = await genRes.json();
  const imageUrl = genJson.data[0].url;
  console.log(`Image URL: ${imageUrl}`);

  console.log('Downloading image...');
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`Image download failed: HTTP ${imgRes.status}`);
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer());

  const outDir = resolve(SITE_ROOT, 'public', 'images', 'articles', slug);
  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, 'hero.jpg');
  writeFileSync(outPath, imgBuffer);
  console.log(`Saved: public/images/articles/${slug}/hero.jpg (${imgBuffer.length.toLocaleString()} bytes)`);

  const snippet = `<ImageBlock src="/images/articles/${slug}/hero.jpg" alt="${title}" caption="Generated with DALL-E 3" />`;
  console.log('\n--- ImageBlock MDX snippet ---');
  console.log(snippet);
  console.log('--- end snippet ---');
  console.log(`\nPaste after the import block in src/content/<lane>/${slug}.mdx`);
  console.log('Note: ImageBlock component requires vault-mzsvu to be merged before this renders.');
}

main().catch(err => {
  console.error(`\nError: ${err.message}`);
  process.exit(1);
});
