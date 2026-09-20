// vault-apg6j: Post-deploy smoke test suite
// Three suites: page loads, mermaid SVG render, OG tag presence.
// Run locally: PLAYWRIGHT_BASE_URL=http://localhost:4321 npm run test:smoke
import { test, expect } from '@playwright/test';

// Key pages to smoke test — all public routes
const PAGES = [
  { path: '/', name: 'home' },
  { path: '/research', name: 'research lane' },
  { path: '/analysis', name: 'analysis lane' },
  { path: '/build-logs', name: 'build-logs lane' },
  { path: '/about', name: 'about' },
];

// Articles confirmed to contain mermaid diagrams (grep -l "mermaid" src/content/**/*.mdx)
// Update this list when new diagram articles ship.
const DIAGRAM_ARTICLES = [
  '/build-logs/isa-patterns',
  '/build-logs/b0b-methodology',
];

// Sample of articles to verify OG tag presence
// One per lane + one research deep link. Expand to full crawl in a later pass.
const OG_SAMPLE = [
  '/build-logs/isa-patterns',
  '/analysis/zt-ai-systems',
  '/research/bdd-persona-drift',
];

// Console noise from the CI environment — not real site errors.
//
// Vercel injects a toolbar into preview deployment URLs. In CI with no Vercel
// session the toolbar and its dependencies generate several console errors:
//   - 403/ERR_FAILED on Vercel's own API (no auth token in CI)
//   - CORS failures when toolbar tries to report to Sentry (o205439.ingest.sentry.io)
//   - FedCM credential API noise ("Provider's accounts list is empty",
//     "[GSI_LOGGER]: FedCM get() rejects") when no Google accounts are present
//   - favicon 404s on some environments
//
// These are filtered rather than suppressed at the request level because
// extraHTTPHeaders propagates to cross-origin preflight requests, causing
// Sentry's CORS policy to reject the custom header — more errors, not fewer.
const IGNORED_CONSOLE_PATTERNS = [
  'favicon',
  "Provider's accounts list is empty",           // Chrome FedCM noise (Vercel toolbar)
  '[GSI_LOGGER]',                                // Google Sign-In FedCM error logger
  'FedCM',                                       // Any FedCM API failure
  'sentry.io',                                   // Vercel toolbar Sentry reporter
  'Failed to load resource: the server responded with a status of 403 ()',  // Vercel toolbar API (empty URL = toolbar-internal)
  'Failed to load resource: net::ERR_FAILED',    // Vercel toolbar network failure
];

test.describe('Page smoke tests', () => {
  for (const page of PAGES) {
    test(`${page.name} loads`, async ({ page: p }) => {
      const errors: string[] = [];
      p.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      const response = await p.goto(page.path);
      expect(response?.status()).toBe(200);
      await p.waitForLoadState('networkidle');
      const realErrors = errors.filter(e => !IGNORED_CONSOLE_PATTERNS.some(pat => e.includes(pat)));
      expect(realErrors).toHaveLength(0);
    });
  }
});

test.describe('Mermaid SVG rendering', () => {
  for (const articlePath of DIAGRAM_ARTICLES) {
    test(`${articlePath} renders SVG diagrams`, async ({ page }) => {
      await page.goto(articlePath);
      await page.waitForLoadState('networkidle');
      // Mermaid renders <svg> inside .diagram-inner client-side (DiagramBlock.astro)
      const svgCount = await page.locator('.diagram-inner svg').count();
      expect(svgCount).toBeGreaterThan(0);
      // No mermaid syntax errors in diagram containers
      const diagramTexts = await page.locator('.diagram-inner').allTextContents();
      const hasSyntaxError = diagramTexts.some(t => t.includes('Syntax error'));
      expect(hasSyntaxError).toBe(false);
    });
  }
});

test.describe('OG tag presence', () => {
  for (const articlePath of OG_SAMPLE) {
    test(`${articlePath} has required OG tags`, async ({ page }) => {
      await page.goto(articlePath);
      await page.waitForLoadState('networkidle');

      // og:title
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      expect(ogTitle).toBeTruthy();
      expect(ogTitle!.length).toBeGreaterThan(5);

      // og:description
      const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content');
      expect(ogDesc).toBeTruthy();

      // og:image
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(ogImage).toBeTruthy();

      // twitter:card
      const twCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
      expect(twCard).toBeTruthy();
    });
  }
});
