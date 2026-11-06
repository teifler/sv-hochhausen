// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { legacyRedirects } from './src/data/redirects.js';

// Öffentliche Adresse der Website (Canonical-Links, Open Graph, Sitemap).
// Auf Vercel als Umgebungsvariable SITE_URL setzen, sobald die echte Domain steht.
const SITE = process.env.SITE_URL || 'https://sv-hochhausen.vercel.app';

export default defineConfig({
  site: SITE,
  // Alle Seiten werden statisch gebaut (schnell, kein Server nötig).
  // Nur die Formular-Endpunkte unter /api laufen als Vercel-Funktion.
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) =>
        !/\/(kontakt|spenden)\/danke|\/suche/.test(page) &&
        !Object.keys(legacyRedirects).some((p) => decodeURIComponent(new URL(page).pathname).replace(/\/$/, '') === `/${p}`),
    }),
  ],
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
