// vault-apg6j: Playwright smoke test configuration
// PLAYWRIGHT_BASE_URL lets CI point at Vercel preview URL without code changes.
import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4321';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    // Skip Vercel's injected toolbar on preview URLs — it fires FedCM noise
    // and a 403 on its own API call in CI (no Vercel auth), causing false failures.
    extraHTTPHeaders: { 'x-vercel-skip-toolbar': '1' },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
