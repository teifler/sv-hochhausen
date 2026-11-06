// @ts-check
import { defineConfig, devices } from '@playwright/test'

/* E2E-Tests gegen den fertigen statischen Build (vorher `npm run build:local`).
   Getestet wird wie ein Besucher: Desktop (1280 px) und kleines Handy (360 px). */
const PORT = 4173
process.env.SVH_STATIC_DIR ||= '.vercel/output/static'

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 360, height: 780 } } },
  ],
  webServer: {
    command: `node scripts/serve.mjs --port ${PORT}`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
  },
})
