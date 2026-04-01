import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Morse App web E2E tests
 * Tests Expo web via http://localhost:8081
 * Auto-starts `expo start --web` via webServer config
 */
export default defineConfig({
  testDir: './e2e/tests',
  testMatch: '*.spec.ts',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    baseURL: 'http://localhost:8081',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  webServer: {
    command: 'npx expo start --web --port 8081',
    url: 'http://localhost:8081',
    reuseExistingServer: !process.env.CI,
    timeout: 90_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-web',
      use: { ...devices['Pixel 7'] },
    },
  ],
});
