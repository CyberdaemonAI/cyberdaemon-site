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
      // Favicon 404s are expected on some environments — not a failure
      const realErrors = errors.filter(e => !e.includes('favicon'));
      expect(realErrors).toHaveLength(0);
    });
  }
});

test.describe('Mermaid SVG rendering', () => {
  for (const articlePath of DIAGRAM_ARTICLES) {
    test(`${articlePath} renders SVG diagrams`, async ({ page }) => {
      await page.goto(articlePath);
      await page.waitForLoadState('networkidle');
      // Mermaid renders <svg> inside the diagram container client-side
      const svgCount = await page.locator('svg').count();
      expect(svgCount).toBeGreaterThan(0);
      // No raw mermaid code blocks visible (class="language-mermaid" = not rendered)
      const rawMermaid = await page.locator('code.language-mermaid').count();
      expect(rawMermaid).toBe(0);
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
