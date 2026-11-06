/* Kontakt- und Spendenformular gegen echtes PHP (public/api/*.php).
   mail() schreibt in SVH_MAIL_LOG (siehe playwright.config.js) – es geht keine echte E-Mail raus. */
import { existsSync, readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

test.skip(process.env.SVH_E2E_PHP !== '1', 'Formular-Tests brauchen PHP (laufen in der CI)')

const mails = () =>
  existsSync(process.env.SVH_MAIL_LOG) ? readFileSync(process.env.SVH_MAIL_LOG, 'utf8').split(/^(?=To: )/m) : []
const mailWith = (marker) => mails().find((m) => m.includes(marker))
const headerBlock = (mail) => mail.split(/\r?\n\r?\n/)[0]
const marker = (info) => `E2E-${info.project.name}-${Date.now()}-${Math.round(Math.random() * 1e6)}`

/* Zeitsperre: gilt als Spam, wenn weniger als 3 s seit dem Laden vergangen sind */
const backdate = (form) => form.locator('[name="ts"]').evaluate((el) => (el.value = String(Date.now() - 5000)))

const contactFields = (m, extra = {}) => ({
  name: 'Erika Muster',
  email: 'erika@example.com',
  topic: 'mitgliedschaft',
  message: `Testnachricht ${m} – bitte ignorieren.`,
  consent: 'ja',
  ts: String(Date.now() - 5000),
  ...extra,
})

test('Kontaktformular sendet per JavaScript und zeigt die Bestätigung', async ({ page }, info) => {
  const m = marker(info)
  await page.goto('/kontakt/')
  const form = page.locator('form[action="/api/contact.php"]')
  await form.locator('[name="name"]').fill('Erika Muster')
  await form.locator('[name="email"]').fill('erika@example.com')
  await form.locator('[name="topic"]').selectOption('probetraining')
  await form.locator('[name="message"]').fill(`Hallo, ich möchte gern mitmachen. ${m}`)
  await form.locator('[name="consent"]').check()
  await backdate(form)
  await form.locator('[type="submit"]').click()

  await expect(form.locator('.svh-form__success')).toContainText('Danke')
  await expect.poll(() => Boolean(mailWith(m))).toBe(true)
  const mail = mailWith(m)
  expect(mail).toContain('Anliegen: Probetraining / Schnuppern')
  expect(mail).toContain('E-Mail: erika@example.com')
  expect(headerBlock(mail)).toMatch(/^Reply-To: "Erika Muster" <erika@example\.com>\r?$/m)
  expect(headerBlock(mail)).toMatch(/^Content-Type: text\/plain; charset=UTF-8\r?$/m)
})

test.describe('ohne JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('Kontaktformular leitet auf die Danke-Seite weiter', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'einmal genügt')
    const m = marker(info)
    await page.goto('/kontakt/')
    const form = page.locator('form[action="/api/contact.php"]')
    await form.locator('[name="name"]').fill('Max Ohnejs')
    await form.locator('[name="email"]').fill('max@example.com')
    await form.locator('[name="message"]').fill(`Nachricht ohne JavaScript ${m}`)
    await form.locator('[name="consent"]').check()
    await form.locator('[type="submit"]').click()

    await expect(page).toHaveURL(/\/kontakt\/danke\/$/)
    expect(mailWith(m)).toBeTruthy()
  })
})

test('Spendenformular: eigener Betrag mit Quittung, Bestätigung nennt die Bankverbindung', async ({ page }, info) => {
  const m = marker(info)
  await page.goto('/spenden/')
  const form = page.locator('form[action="/api/spende.php"]')
  await form.locator('.svh-amount', { hasText: 'Anderer Betrag' }).click()
  await form.locator('[name="amountOther"]').fill('12.50')
  await form.locator('[name="name"]').fill('Sabine Spender')
  await form.locator('[name="email"]').fill('sabine@example.com')
  await form.locator('[name="receipt"]').check()
  await form.locator('[name="street"]').fill('Hauptstraße 1')
  await form.locator('[name="city"]').fill('97941 Tauberbischofsheim')
  await form.locator('[name="message"]').fill(m)
  await form.locator('[name="consent"]').check()
  await backdate(form)
  await form.locator('[type="submit"]').click()

  await expect(form.locator('.svh-form__success')).toContainText('IBAN')
  await expect.poll(() => Boolean(mailWith(m))).toBe(true)
  const mail = mailWith(m)
  expect(mail).toContain('Betrag: 12,5 €')
  expect(mail).toContain('Spendenquittung gewünscht: ja')
  expect(mail).toContain('Anschrift: Hauptstraße 1, 97941 Tauberbischofsheim')
})

test.describe('Endpunkte direkt', () => {
  test.skip(({ isMobile }) => isMobile, 'kein Browser nötig – einmal genügt')
  const json = { Accept: 'application/json' }

  test('Header-Injection über den Namen ist wirkungslos', async ({ request }, info) => {
    const m = marker(info)
    const res = await request.post('/api/contact.php', {
      headers: json,
      form: contactFields(m, { name: 'Max\r\nBcc: evil@example.com' }),
    })
    expect(res.status()).toBe(200)
    await expect.poll(() => Boolean(mailWith(m))).toBe(true)
    const head = headerBlock(mailWith(m))
    expect(head).not.toMatch(/^Bcc:/im)
    expect(head).toMatch(/^Reply-To: "Max Bcc: evil@example\.com" <erika@example\.com>\r?$/m)
  })

  test('Honeypot: antwortet „ok“, verschickt aber nichts', async ({ request }, info) => {
    const m = marker(info)
    const res = await request.post('/api/contact.php', {
      headers: json,
      form: contactFields(m, { website: 'https://spam.example' }),
    })
    expect(await res.json()).toMatchObject({ ok: true })
    await new Promise((r) => setTimeout(r, 500))
    expect(mailWith(m)).toBeUndefined()
  })

  test('zu schnell abgeschickt → 429 spam', async ({ request }, info) => {
    const res = await request.post('/api/contact.php', {
      headers: json,
      form: contactFields(marker(info), { ts: String(Date.now()) }),
    })
    expect(res.status()).toBe(429)
    expect(await res.json()).toEqual({ ok: false, error: 'spam' })
  })

  test('fehlende Einwilligung → 422 invalid', async ({ request }, info) => {
    const res = await request.post('/api/spende.php', {
      headers: json,
      form: {
        name: 'Ohne Haken',
        email: 'x@example.com',
        amount: '50',
        ts: String(Date.now() - 5000),
        note: marker(info),
      },
    })
    expect(res.status()).toBe(422)
    expect(await res.json()).toEqual({ ok: false, error: 'invalid' })
  })

  test('GET leitet zurück zum Formular, Interna sind gesperrt', async ({ request }) => {
    const get = await request.get('/api/contact.php', { maxRedirects: 0 })
    expect(get.status()).toBe(303)
    expect(get.headers()['location']).toBe('/kontakt/')
    expect((await request.get('/api/config.json')).status()).toBe(403)
    expect((await request.get('/api/_lib.php')).status()).toBe(403)
  })
})
