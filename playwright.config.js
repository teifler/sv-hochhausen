// @ts-check
import { spawnSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import { defineConfig, devices } from '@playwright/test'

/* E2E-Tests gegen den fertigen statischen Build (vorher `npm run build:local`).
   Getestet wird wie ein Besucher: Desktop (1280 px) und kleines Handy (360 px).

   Mit PHP (in der CI immer, lokal falls installiert) läuft der Build in `php -S` – dann werden auch die
   Formulare getestet. mail() schreibt dabei in eine Datei statt E-Mails zu verschicken. Ohne PHP genügt
   scripts/serve.mjs, die Formular-Tests werden übersprungen. SVH_E2E_PHP=1 erzwingt PHP (CI). */
const PORT = 4173
process.env.SVH_STATIC_DIR ||= 'dist'

const phpAvailable = spawnSync('php', ['-v'], { stdio: 'ignore' }).status === 0
if (process.env.SVH_E2E_PHP === '1' && !phpAvailable) throw new Error('SVH_E2E_PHP=1, aber kein PHP gefunden')
process.env.SVH_E2E_PHP ||= phpAvailable ? '1' : '0'
process.env.SVH_MAIL_LOG ||= path.join(os.tmpdir(), `svh-e2e-mails-${process.pid}.log`)

const phpServer = [
  'php',
  `-d "sendmail_path=sh -c 'cat >> ${process.env.SVH_MAIL_LOG}' sh"`,
  '-d display_errors=stderr',
  `-S 127.0.0.1:${PORT}`,
  `-t ${process.env.SVH_STATIC_DIR}`,
  'tests/e2e/php-router.php',
].join(' ')

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 360, height: 780 } } },
  ],
  webServer: {
    command: process.env.SVH_E2E_PHP === '1' ? phpServer : `node scripts/serve.mjs --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env.CI,
  },
})
