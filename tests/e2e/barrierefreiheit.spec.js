/* Barrierefreiheit mit axe-core (WCAG 2.1 A/AA): jede Seite der Sitemap, Desktop und Handy.
   Gemeldet werden Verstöße der Stufen „serious“ und „critical“ – mit Element und Hinweis. */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const dir = process.env.SVH_STATIC_DIR || 'dist'
const pages = [...readFileSync(path.join(dir, 'sitemap-0.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => new URL(m[1]).pathname,
)

/* Ohne Animationen messen – sonst prüft axe Farben mitten im Einblenden */
test.use({ reducedMotion: 'reduce' })

for (const pathname of pages) {
  test(`WCAG AA: ${decodeURIComponent(pathname)}`, async ({ page }) => {
    await page.goto(pathname)
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    const serious = violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => `${v.id} (${v.nodes.length}×): ${v.nodes[0].target.join(' ')} – ${v.help}`)
    expect(serious, 'Verstöße gegen WCAG 2.1 AA').toEqual([])
  })
}
