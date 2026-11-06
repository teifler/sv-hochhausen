import { describe, expect, it } from 'vitest'
import { escapeHtml, hrefFor, normalize, searchIndex } from '../src/scripts/searchcore.js'

/* Einträge wie in src/lib/search.js (n = Titel + Text, nt = Titel, beide normalisiert) */
const entry = (title, text = '') => ({ title, text, n: normalize(`${title} ${text}`), nt: normalize(title) })

describe('normalize', () => {
  it('macht Umlaute, ß und Akzente suchbar', () => {
    expect(normalize('Bogenschießen')).toBe('bogenschiessen')
    expect(normalize('Fußball-Jugend')).toBe('fussball jugend')
    expect(normalize('  Übungsleiter:in  ')).toBe('ubungsleiter in')
    expect(normalize('Café')).toBe('cafe')
  })
})

describe('searchIndex', () => {
  const index = [
    entry('Bogenschießen', 'Training in der Halle'),
    entry('Darts', 'Steeldarts im Sportheim'),
    entry('Sportheim', 'Vermietung und Öffnungszeiten'),
  ]

  it('braucht mindestens zwei Zeichen', () => {
    expect(searchIndex(index, 'b')).toEqual([])
  })

  it('findet auch ohne Umlaute und ß', () => {
    expect(searchIndex(index, 'bogenschiessen').map((i) => i.title)).toEqual(['Bogenschießen'])
  })

  it('verlangt, dass alle Suchwörter vorkommen', () => {
    expect(searchIndex(index, 'sportheim steeldarts').map((i) => i.title)).toEqual(['Darts'])
  })

  it('rankt Treffer im Titel vor Treffern im Text', () => {
    expect(searchIndex(index, 'sportheim').map((i) => i.title)).toEqual(['Sportheim', 'Darts'])
  })

  it('beachtet das Limit', () => {
    expect(searchIndex(index, 'in', 1)).toHaveLength(1)
  })
})

describe('escapeHtml', () => {
  it('maskiert HTML-Sonderzeichen', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;')
  })
})

describe('hrefFor', () => {
  it('lässt Links ohne Vorschau-Basis unverändert', () => {
    expect(hrefFor('kontakt/')).toBe('kontakt/')
    expect(hrefFor('/kontakt/')).toBe('/kontakt/')
  })
})
