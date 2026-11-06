import { afterEach, describe, expect, it, vi } from 'vitest'
import { EMAIL_RE, line, respond, spamCheck, text } from '../src/lib/formutil.js'

const form = (fields) => {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.set(k, v)
  return fd
}

describe('text / line', () => {
  it('kürzt und trimmt Eingaben', () => {
    expect(text('  hallo  ')).toBe('hallo')
    expect(text('x'.repeat(10), 4)).toBe('xxxx')
    expect(text(null)).toBe('')
  })

  it('line() entfernt Zeilenumbrüche (Schutz vor Header-Injection)', () => {
    expect(line('Max\r\nBcc: spam@example.com')).toBe('Max Bcc: spam@example.com')
    expect(line('a\n\n\nb')).toBe('a b')
  })
})

describe('EMAIL_RE', () => {
  it('akzeptiert normale Adressen und lehnt Unsinn ab', () => {
    expect(EMAIL_RE.test('info@sportverein-hochhausen.de')).toBe(true)
    expect(EMAIL_RE.test('kein-at-zeichen.de')).toBe(false)
    expect(EMAIL_RE.test('a@b.c')).toBe(false)
    expect(EMAIL_RE.test('mit leerzeichen@x.de')).toBe(false)
  })
})

describe('spamCheck', () => {
  afterEach(() => vi.useRealTimers())

  it('erkennt den ausgefüllten Honeypot', () => {
    expect(spamCheck(form({ website: 'https://spam.example' }))).toBe('honeypot')
  })

  it('blockt Formulare, die schneller als 3 s abgeschickt werden', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-06T12:00:10Z'))
    const now = Date.now()
    expect(spamCheck(form({ ts: String(now - 1000) }))).toBe('too_fast')
    expect(spamCheck(form({ ts: String(now - 5000) }))).toBeNull()
  })

  it('lässt Formulare ohne Zeitstempel durch (ohne JavaScript wird ts nicht gesetzt)', () => {
    expect(spamCheck(form({ ts: '' }))).toBeNull()
    expect(spamCheck(form({}))).toBeNull()
  })
})

describe('respond', () => {
  const req = (accept) => new Request('https://example.test/api/contact', { method: 'POST', headers: { accept } })

  it('antwortet fetch()-Aufrufen mit JSON', async () => {
    const res = respond(req('application/json'), 422, { ok: false, error: 'invalid' }, '/kontakt/fehler/')
    expect(res.status).toBe(422)
    expect(res.headers.get('content-type')).toContain('application/json')
    expect(await res.json()).toEqual({ ok: false, error: 'invalid' })
  })

  it('leitet ohne JavaScript per 303 weiter', () => {
    const res = respond(req('text/html'), 200, { ok: true }, '/kontakt/danke/')
    expect(res.status).toBe(303)
    expect(res.headers.get('location')).toBe('/kontakt/danke/')
  })
})
