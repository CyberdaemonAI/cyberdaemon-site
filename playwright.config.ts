// vault-apg6j: Playwright smoke test configuration
// PLAYWRIGHT_BASE_URL lets CI point at Vercel preview URL without code changes.
// vault-ttzn: Vercel automation bypass header for preview deployments.
import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4321';
const isVercelPreview = BASE_URL.includes('.vercel.app');
const vercelBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    extraHTTPHeaders: {
      // Skip Vercel's injected toolbar on preview URLs — it fires FedCM noise
      // and a 403 on its own API call in CI (no Vercel auth), causing false failures.
      'x-vercel-skip-toolbar': '1',
      // Bypass Vercel preview protection — only on .vercel.app URLs, never production.
      // Requires: Vercel dashboard Protection Bypass enabled + VERCEL_AUTOMATION_BYPASS_SECRET set.
      ...(isVercelPreview && vercelBypassSecret
        ? { 'x-vercel-protection-bypass': vercelBypassSecret }
        : {}),
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
