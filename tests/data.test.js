/* Plausibilitätschecks für die Inhalte in src/data/ – fangen Tippfehler ab, bevor sie live gehen. */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { documents } from '../src/data/documents.js'
import { donate } from '../src/data/donate.js'
import { fussballde } from '../src/data/fussballde.js'
import { news } from '../src/data/news.js'
import { legacyRedirects } from '../src/data/redirects.js'
import { sports, trainingSlots } from '../src/data/sports.js'
import { nextMatch, upcomingFixtures } from '../src/data/teams.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PAGES = path.join(ROOT, 'src/pages')

/* Statische Seiten: Route → Quelldatei (z. B. '/kontakt/' → 'kontakt/index.astro') */
function staticRoutes(dir = PAGES, base = '') {
  const routes = new Map()
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name)
    if (entry.isDirectory()) {
      for (const [r, f] of staticRoutes(path.join(dir, entry.name), rel)) routes.set(r, f)
    } else if (entry.name.endsWith('.astro') && !entry.name.includes('[')) {
      const slug = rel.replace(/\.astro$/, '').replace(/(^|\/)index$/, '')
      routes.set(slug ? `/${slug}/` : '/', rel)
    }
  }
  return routes
}

const routes = staticRoutes()
/* Dynamische Seiten wie in getStaticPaths (Fußball hat eine eigene Seite /fussball/) */
const allRoutes = new Set([
  ...routes.keys(),
  ...sports.filter((s) => s.slug !== 'fussball').map((s) => `/sport/${s.slug}/`),
  ...news.map((n) => `/aktuelles/${n.slug}/`),
])

describe('Spenden: Bankverbindung', () => {
  it('hat eine gültige IBAN-Prüfziffer (ISO 13616, mod 97)', () => {
    const iban = donate.bank.iban?.replace(/\s/g, '')
    if (!iban) return // Platzhalter erlaubt: Seite zeigt dann einen Hinweis
    expect(iban).toMatch(/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/)
    const digits = (iban.slice(4) + iban.slice(0, 4)).replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55))
    expect(BigInt(digits) % 97n).toBe(1n)
  })
})

describe('Links & Weiterleitungen', () => {
  it('alle Abteilungs-Links zeigen auf existierende Seiten', () => {
    for (const s of sports) expect(allRoutes, `${s.name} → ${s.to}`).toContain(s.to)
  })

  it('alle Weiterleitungen alter Adressen zeigen auf existierende Seiten und Anker', () => {
    for (const [from, to] of Object.entries(legacyRedirects)) {
      const [route, anchor] = to.split('#')
      expect(allRoutes, `/${from}/ → ${to}`).toContain(route)
      if (anchor) {
        const source = readFileSync(path.join(PAGES, routes.get(route)), 'utf8')
        expect(source, `Anker #${anchor} fehlt in ${routes.get(route)}`).toContain(`id="${anchor}"`)
      }
    }
  })

  it('lokale Downloads liegen in public/', () => {
    for (const d of documents.filter((x) => x.url.startsWith('/'))) {
      expect(existsSync(path.join(ROOT, 'public', decodeURIComponent(d.url))), d.url).toBe(true)
    }
  })

  it('Weiterleitungen überschreiben keine echten Seiten', () => {
    for (const from of Object.keys(legacyRedirects)) expect(allRoutes).not.toContain(`/${from}/`)
  })
})

describe('Inhalte', () => {
  it('Slugs sind eindeutig', () => {
    for (const list of [sports, news]) {
      const slugs = list.map((x) => x.slug)
      expect(new Set(slugs).size).toBe(slugs.length)
    }
  })

  it('Trainingszeiten haben gültige Wochentage und Uhrzeiten', () => {
    for (const slot of trainingSlots) {
      expect(slot.day).toBeGreaterThanOrEqual(0)
      expect(slot.day).toBeLessThanOrEqual(6)
      // erlaubt sind z. B. '19:00', '18:00–20:00' oder 'ab 19:30'
      expect(slot.time).toMatch(/\d{1,2}:\d{2}/)
    }
  })
})

describe('Spielplan-Helfer', () => {
  it('upcomingFixtures liefert nur künftige Spiele, chronologisch sortiert', () => {
    const list = upcomingFixtures('2000-01-01')
    expect(list).toHaveLength(fussballde.fixtures.length)
    const keys = list.map((f) => `${f.date} ${f.time || ''}`)
    expect(keys).toEqual([...keys].sort())
  })

  it('nextMatch ist null, wenn keine Spiele mehr anstehen', () => {
    expect(nextMatch('2999-12-31')).toBeNull()
  })
})
