import { describe, expect, it } from 'vitest'
import { fmtLong, fmtLongWeekday, fmtShort, fmtTime, todayKey, weekdayShort } from '../src/lib/format.js'

describe('todayKey', () => {
  it('liefert das Datum in deutscher Zeit, nicht in UTC', () => {
    // 23:30 UTC am Silvesterabend = 00:30 am Neujahrstag in Berlin
    expect(todayKey(new Date('2026-12-31T23:30:00Z'))).toBe('2027-01-01')
    // Sommerzeit: 22:30 UTC = 00:30 MESZ
    expect(todayKey(new Date('2027-06-30T22:30:00Z'))).toBe('2027-07-01')
  })

  it('hat das Format JJJJ-MM-TT', () => {
    expect(todayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('Datumsformatierung', () => {
  it('schreibt Monate und Wochentage auf Deutsch aus', () => {
    expect(fmtLong('2027-05-01')).toBe('1. Mai 2027')
    expect(fmtLongWeekday('2027-05-01')).toBe('Samstag, 1. Mai 2027')
    expect(fmtShort('2027-03-14')).toBe('14. Mär 2027')
    expect(weekdayShort('2026-11-06')).toBe('Fr')
  })
})

describe('fmtTime', () => {
  it('hängt „Uhr“ an, aber nicht doppelt', () => {
    expect(fmtTime('19:30')).toBe('19:30 Uhr')
    expect(fmtTime('19:30 Uhr')).toBe('19:30 Uhr')
    expect(fmtTime('')).toBe('')
    expect(fmtTime(undefined)).toBe('')
  })
})
