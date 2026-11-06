import { describe, expect, it } from 'vitest'
import { buildIcs, icsEscape } from '../src/scripts/ics.js'

const NOW = new Date('2026-11-06T09:15:30.123Z')
const lines = (ics) => ics.split('\r\n')

describe('icsEscape', () => {
  it('maskiert Sonderzeichen nach RFC 5545', () => {
    expect(icsEscape('a;b,c\\d')).toBe('a\\;b\\,c\\\\d')
    expect(icsEscape('Zeile 1\nZeile 2\r\nZeile 3')).toBe('Zeile 1\\nZeile 2\\nZeile 3')
  })
})

describe('buildIcs', () => {
  it('erzeugt einen Termin mit Uhrzeit und Standarddauer von 2 Stunden', () => {
    const ics = buildIcs(
      { id: 'spiel-1', title: 'SpG Hochhausen – Wertheim', date: '2027-04-11', time: '13:00', location: 'Sportplatz' },
      NOW,
    )
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true)
    expect(lines(ics)).toEqual(
      expect.arrayContaining([
        'UID:spiel-1@sv-hochhausen-1946',
        'DTSTAMP:20261106T091530Z',
        'DTSTART:20270411T130000',
        'DTEND:20270411T150000',
        'SUMMARY:SpG Hochhausen – Wertheim',
        'LOCATION:Sportplatz',
        'END:VCALENDAR',
      ]),
    )
  })

  it('nutzt durationMin für das Ende', () => {
    const ics = buildIcs({ id: 'x', title: 'Training', date: '2027-01-05', time: '18:30', durationMin: 90 }, NOW)
    expect(lines(ics)).toContain('DTEND:20270105T200000')
  })

  it('legt Termine ohne Uhrzeit als Ganztagstermin an (auch über den Monatswechsel)', () => {
    const ics = buildIcs({ id: 'fest', title: 'Sportfest', date: '2027-07-31' }, NOW)
    expect(lines(ics)).toEqual(expect.arrayContaining(['DTSTART;VALUE=DATE:20270731', 'DTEND;VALUE=DATE:20270801']))
  })

  it('maskiert Titel, Ort und Beschreibung', () => {
    const ics = buildIcs(
      { id: 'x', title: 'Wandern; Treffpunkt, Kirche', date: '2027-05-01', description: 'Mitbringen:\nVesper' },
      NOW,
    )
    expect(lines(ics)).toContain('SUMMARY:Wandern\\; Treffpunkt\\, Kirche')
    expect(lines(ics)).toContain('DESCRIPTION:Mitbringen:\\nVesper')
  })
})
