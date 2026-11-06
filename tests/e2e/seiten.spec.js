/* Rundgang über alle Seiten der Sitemap: lädt, hat Titel + Überschrift, keine JS-Fehler,
   kein seitliches Scrollen und – Datenschutz – keine einzige Anfrage an fremde Server. */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'

const dir = process.env.SVH_STATIC_DIR || '.vercel/output/static'
const pages = [...readFileSync(path.join(dir, 'sitemap-0.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => new URL(m[1]).pathname,
)

test('Sitemap enthält die wichtigsten Seiten', () => {
  for (const p of ['/', '/verein/', '/sport/', '/fussball/', '/termine/', '/kalender/', '/spenden/', '/kontakt/']) {
    expect(pages).toContain(p)
  }
})

for (const pathname of pages) {
  test(`Seite ${decodeURIComponent(pathname)}`, async ({ page, baseURL }) => {
    const errors = []
    const external = []
    const origin = new URL(baseURL).origin
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    page.on('request', (r) => {
      const u = new URL(r.url())
      if (u.protocol.startsWith('http') && u.origin !== origin) external.push(r.url())
    })

    const res = await page.goto(pathname)
    expect(res?.status()).toBe(200)
    await expect(page).toHaveTitle(/SV Hochhausen/)
    await expect(page.locator('h1').first()).toBeVisible()

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, 'horizontale Scrollbar').toBeLessThanOrEqual(0)
    expect(errors, 'Fehler in der Konsole').toEqual([])
    expect(external, 'Anfragen an Dritte beim Laden').toEqual([])
  })
}

test('unbekannte Adresse zeigt die 404-Seite', async ({ page }) => {
  const res = await page.goto('/gibt-es-nicht/')
  expect(res?.status()).toBe(404)
  await expect(page.locator('h1').first()).toBeVisible()
})
