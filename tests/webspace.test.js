/* Webspace-Ausgabe: Formular-Konfiguration (/api/config.json) und .htaccess */
import { describe, expect, it } from 'vitest'
import { contactTopics, formActions } from '../src/data/forms.js'
import { hosting } from '../src/data/hosting.js'
import { legacyRedirects } from '../src/data/redirects.js'
import { formConfig } from '../src/lib/formconfig.js'
import { ASSETS_HTACCESS, buildHtaccess } from '../src/lib/htaccess.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

describe('formConfig (/api/config.json für die PHP-Formulare)', () => {
  const config = formConfig()

  it('hat gültige Empfänger- und Absenderadressen', () => {
    for (const key of ['mailTo', 'donationTo', 'mailFrom']) expect(config[key], key).toMatch(EMAIL_RE)
  })

  it('enthält alle Anliegen des Kontaktformulars', () => {
    expect(Object.keys(config.topics)).toEqual(contactTopics.map(([v]) => v))
    expect(config.topics.allgemein).toBeTruthy()
  })

  it('enthält die Bankverbindung für die Danke-Meldung', () => {
    if (!config.bank) return
    expect(config.bank.iban).toMatch(/^[A-Z]{2}\d{2}/)
  })

  it('Formulare zeigen auf die PHP-Endpunkte', () => {
    expect(formActions).toEqual({ contact: '/api/contact.php', donation: '/api/spende.php' })
  })
})

describe('buildHtaccess', () => {
  const ht = buildHtaccess({ redirects: legacyRedirects })

  it('leitet alte Adressen per 301 weiter – mit und ohne Schrägstrich, Anker bleiben erhalten', () => {
    expect(ht).toContain('RewriteRule ^der-verein/?$ /verein/ [R=301,L,NE]')
    expect(ht).toContain('RewriteRule ^der-verein/vorstand/?$ /verein/#vorstand [R=301,L,NE]')
    expect(ht).toContain('RewriteRule ^sportarten/bogenschießen/?$ /sport/bogenschiessen/ [R=301,L,NE]')
    expect(ht.match(/^ {2}RewriteRule \^/gm)).toHaveLength(Object.keys(legacyRedirects).length)
  })

  it('sperrt Formular-Interna und nutzt die eigene 404-Seite', () => {
    expect(ht).toContain('<FilesMatch "^(_lib\\.php|config\\.json)$">')
    expect(ht).toContain('Require all denied')
    expect(ht).toContain('ErrorDocument 404 /404.html')
    expect(ht).toContain('Options -Indexes')
  })

  it('erzwingt HTTPS nur, wenn eingeschaltet', () => {
    expect(ht).not.toContain('Strict-Transport-Security')
    const https = buildHtaccess({ redirects: {}, forceHttps: true })
    expect(https).toContain('RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L,NE]')
    expect(https).toContain('RewriteCond %{REQUEST_URI} !^/\\.well-known/')
    expect(https).toContain('Strict-Transport-Security')
  })

  it('lehnt Weiterleitungen mit Leerzeichen ab', () => {
    expect(() => buildHtaccess({ redirects: { 'alte seite': '/neu/' } })).toThrow()
  })

  it('Schalter in src/data/hosting.js ist ein Boolean', () => {
    expect(typeof hosting.forceHttps).toBe('boolean')
  })

  it('Assets mit Hash dürfen lange gecacht werden', () => {
    expect(ASSETS_HTACCESS).toContain('immutable')
  })
})
