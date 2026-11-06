// @ts-check
import { mkdir, writeFile } from 'node:fs/promises'
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import { legacyRedirects } from './src/data/redirects.js'
import { hosting } from './src/data/hosting.js'
import { ASSETS_HTACCESS, buildHtaccess } from './src/lib/htaccess.js'

// Öffentliche Adresse der Website (Canonical-Links, Open Graph, Sitemap).
const SITE = process.env.SITE_URL || 'https://sportverein-hochhausen.de'

/* .htaccess für den Apache-Webspace: echte 301-Weiterleitungen, 404-Seite, Caching, Sicherheits-Header */
function htaccess() {
  return {
    name: 'svh-htaccess',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        await writeFile(new URL('.htaccess', dir), buildHtaccess({ redirects: legacyRedirects, ...hosting }))
        await mkdir(new URL('_astro/', dir), { recursive: true })
        await writeFile(new URL('_astro/.htaccess', dir), ASSETS_HTACCESS)
      },
    },
  }
}

export default defineConfig({
  site: SITE,
  // Rein statische Website für den Webspace; die Formulare laufen dort als PHP (public/api/*.php).
  integrations: [
    sitemap({
      filter: (page) =>
        !/\/(kontakt|spenden)\/danke|\/suche/.test(page) &&
        !Object.keys(legacyRedirects).some(
          (p) => decodeURIComponent(new URL(page).pathname).replace(/\/$/, '') === `/${p}`,
        ),
    }),
    htaccess(),
  ],
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
})
