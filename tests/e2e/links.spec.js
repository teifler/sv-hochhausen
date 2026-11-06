/* Link-Check: jeder interne Link auf jeder Seite der Sitemap führt zu einer existierenden Seite bzw. Datei,
   jeder Anker (#…) existiert auf der Zielseite. Keine Links mehr auf die alte Website. */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'

const dir = process.env.SVH_STATIC_DIR || 'dist'
const pages = [...readFileSync(path.join(dir, 'sitemap-0.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => new URL(m[1]).pathname,
)
const SITE_HOSTS = ['www.sportverein-hochhausen.de', 'sportverein-hochhausen.de']

test('alle internen Links und Anker funktionieren', async ({ page, request, baseURL }, info) => {
  test.skip(info.project.name !== 'desktop', 'einmal genügt')
  test.setTimeout(180_000)
  const origin = new URL(baseURL).origin
  const links = new Map() // Ziel → erste Fundstelle
  const oldSite = []

  for (const p of pages) {
    await page.goto(p)
    const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.href))
    for (const href of hrefs) {
      const u = new URL(href)
      if (SITE_HOSTS.includes(u.hostname)) oldSite.push(`${p} → ${href}`)
      if (u.origin !== origin) continue
      const key = u.pathname + u.hash
      if (!links.has(key)) links.set(key, p)
    }
  }
  expect(oldSite, 'Links mit absoluter Vereinsdomain (sollten relativ sein)').toEqual([])

  const broken = []
  const anchorsByPage = new Map()
  for (const [target, from] of links) {
    const [pathname, hash] = target.split('#')
    const res = await request.head(pathname)
    if (res.status() >= 400) {
      broken.push(`${from} → ${target} (HTTP ${res.status()})`)
      continue
    }
    if (hash && /text\/html/.test(res.headers()['content-type'] || '')) {
      if (!anchorsByPage.has(pathname)) {
        await page.goto(pathname)
        anchorsByPage.set(pathname, new Set(await page.$$eval('[id]', (els) => els.map((e) => e.id))))
      }
      if (!anchorsByPage.get(pathname).has(decodeURIComponent(hash))) broken.push(`${from} → ${target} (Anker fehlt)`)
    }
  }
  expect(broken, 'kaputte interne Links').toEqual([])
  expect(links.size).toBeGreaterThan(30)
})
