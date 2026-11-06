/* =========================================================
   Suchindex (wird beim Build als /suche.json erzeugt)
   ========================================================= */
import { newsSorted } from '../data/news.js'
import { eventsSorted } from '../data/events.js'
import { sports } from '../data/sports.js'
import { venues } from '../data/venues.js'
import { chairs, officers, departmentHeads } from '../data/people.js'
import { documents } from '../data/documents.js'
import { partners, sponsors } from '../data/partners.js'
import { fmtLong } from './format.js'

export function normalize(s = '') {
  return String(s)
    .toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const STATIC_PAGES = [
  {
    title: 'Über den Verein',
    url: '/verein/',
    text: 'Sportverein 1946 Hochhausen Tauber Verein Mitglieder Tradition Integration Inklusion',
  },
  {
    title: 'Vorstand',
    url: '/verein/#vorstand',
    text: 'Vorsitzende Vorstandsteam Schriftführer Kassenwart Beisitzer Kassenprüfer Abteilungsleiter',
  },
  {
    title: 'Vereinsgeschichte',
    url: '/verein/#geschichte',
    text: 'Geschichte Chronik 1946 Gründung Meilensteine 80 Jahre',
  },
  {
    title: 'Sportstätten',
    url: '/verein/#sportstaetten',
    text: 'Sportplatz Sportheim Konradsaal Friedhofsparkplatz Anfahrt',
  },
  {
    title: 'Fußball',
    url: '/fussball/',
    text: 'Fußball SpG Spielgemeinschaft TSV Tauberbischofsheim Kreisklasse Spielplan Tabelle fussball.de Training',
  },
  {
    title: 'Alle Sportangebote',
    url: '/sport/',
    text: 'Abteilungen Sportarten Bogenschießen Darts Damengymnastik Nordic Walking Wandern Fußball',
  },
  { title: 'Jugend', url: '/jugend/', text: 'Jugend Kinder Jugendliche Nachwuchs Jugendleiter Bogenschießen' },
  {
    title: 'Termine & Training',
    url: '/termine/',
    text: 'Termine Veranstaltungen Trainingszeiten Wochenplan Training',
  },
  { title: 'Vereinskalender', url: '/kalender/', text: 'Kalender Termine Monatsansicht' },
  { title: 'Vereinsleben', url: '/vereinsleben/', text: 'Vereinsleben Gemeinschaft Sportheim Maiwanderung Ehrenamt' },
  { title: 'Galerie', url: '/galerie/', text: 'Galerie Fotos Bilder' },
  {
    title: 'Mitglied werden',
    url: '/mitglied-werden/',
    text: 'Mitglied werden Mitgliedschaft Aufnahmeantrag Beitrittserklärung Beitrag Mitgliedsbeitrag Jahresbeitrag Familienbeitrag Kosten Satzung',
  },
  {
    title: 'Mitgliedsbeiträge',
    url: '/mitglied-werden/#beitraege',
    text: 'Beitrag Mitgliedsbeitrag Jahresbeitrag Erwachsene 30 Euro Jugendliche 20 Euro Familie 45 Euro Lastschrift',
  },
  {
    title: 'Spenden',
    url: '/spenden/',
    text: 'Spenden Spende unterstützen Bankverbindung Konto IBAN Sparkasse Tauberfranken GiroCode Überweisung Spendenquittung',
  },
  {
    title: 'Sponsoren',
    url: '/sponsoren/',
    text: 'Sponsoren Sponsor werden Sponsoring Partner Werbung Unterstützer Links',
  },
  { title: 'Kontakt', url: '/kontakt/', text: 'Kontakt Kontaktformular Telefon E-Mail Adresse Anfahrt Sportheim' },
  { title: 'Impressum', url: '/impressum/', text: 'Impressum Vereinsregister Amtsgericht Mannheim' },
  { title: 'Datenschutz', url: '/datenschutz/', text: 'Datenschutz DSGVO Cookies' },
]

export function buildSearchIndex() {
  const items = []
  for (const n of newsSorted) {
    items.push({
      type: 'Nachricht',
      title: n.title,
      url: `/aktuelles/${n.slug}/`,
      text: `${n.excerpt} ${n.category} ${(n.tags || []).join(' ')}`,
      meta: fmtLong(n.date),
    })
  }
  for (const e of eventsSorted) {
    items.push({
      type: 'Termin',
      title: e.title,
      url: '/kalender/',
      text: `${e.description || ''} ${e.location || ''}`,
      meta: fmtLong(e.date),
    })
  }
  for (const s of sports) {
    items.push({
      type: 'Sport',
      title: s.name,
      url: s.to,
      text: `${s.tagline} ${s.intro} ${(s.highlights || []).join(' ')} ${s.lead?.name || ''}`,
      meta: s.tagline,
    })
  }
  for (const v of venues) {
    items.push({
      type: 'Sportstätte',
      title: v.name,
      url: '/verein/#sportstaetten',
      text: `${v.address} ${v.text} ${(v.tags || []).join(' ')}`,
      meta: v.address,
    })
  }
  for (const p of chairs) {
    items.push({
      type: 'Person',
      title: p.name,
      url: '/verein/#vorstand',
      text: `${p.role} ${p.extra || ''}`,
      meta: p.role,
    })
  }
  for (const o of officers) {
    for (const name of o.names)
      items.push({ type: 'Person', title: name, url: '/verein/#vorstand', text: o.role, meta: o.role })
  }
  for (const d of departmentHeads) {
    items.push({
      type: 'Person',
      title: d.name,
      url: d.to,
      text: `Abteilungsleitung ${d.dept}`,
      meta: `Abteilungsleitung ${d.dept}`,
    })
  }
  for (const d of documents) {
    items.push({ type: 'Dokument', title: d.title, url: '/mitglied-werden/#downloads', text: d.desc, meta: d.fileType })
  }
  for (const s of sponsors) {
    items.push({
      type: 'Sponsor',
      title: s.name,
      url: '/sponsoren/',
      text: `Sponsor ${s.category || ''} ${s.place || ''}`,
      meta: s.category || 'Sponsor',
    })
  }
  for (const p of partners) {
    items.push({ type: 'Partner', title: p.name, url: '/sponsoren/', text: p.category, meta: p.category })
  }
  for (const s of STATIC_PAGES) items.push({ type: 'Seite', ...s, meta: '' })

  /* Personen nur einmal pro Name+Ziel */
  const seen = new Set()
  return items
    .filter((i) => {
      const k = `${i.type}|${i.title}|${i.url}|${i.meta}`
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
    .map((i) => ({ ...i, n: normalize(`${i.title} ${i.text}`), nt: normalize(i.title) }))
}
