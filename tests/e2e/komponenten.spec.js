/* Interaktive Bausteine: Galerie, Filter, Kalender, Kopieren, Tastatur-Suche, Skip-Link, Untermenü, „Nach oben“. */
import { expect, test } from '@playwright/test'

test('Galerie: Lightbox mit Pfeiltasten blättern und mit Escape schließen', async ({ page }) => {
  await page.goto('/galerie/')
  const items = page.locator('[data-gallery-item]')
  const total = await items.count()
  expect(total).toBeGreaterThan(1)

  await items.first().click()
  const lb = page.locator('[data-lightbox]')
  await expect(lb).toHaveClass(/is-open/)
  await expect(lb.locator('[data-lb-count]')).toHaveText(`1 / ${total}`)
  await expect(lb.locator('[data-lb-close]')).toBeFocused()

  await page.keyboard.press('ArrowRight')
  await expect(lb.locator('[data-lb-count]')).toHaveText(`2 / ${total}`)
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await expect(lb.locator('[data-lb-count]')).toHaveText(`${total} / ${total}`)

  await page.keyboard.press('Escape')
  await expect(lb).not.toHaveClass(/is-open/)
})

test('Aktuelles: Filter-Chips zeigen nur die gewählte Kategorie', async ({ page }) => {
  await page.goto('/aktuelles/')
  const group = page.locator('[data-filter-group]')
  const items = page.locator('[data-filter-cat]')
  const all = await items.count()

  await group.locator('[data-filter-value="Bogenschießen"]').click()
  await expect(page.locator('[data-filter-cat="Bogenschießen"]:visible')).not.toHaveCount(0)
  await expect(page.locator('[data-filter-cat]:not([data-filter-cat="Bogenschießen"]):visible')).toHaveCount(0)

  await group.locator('[data-filter-value="alle"]').click()
  await expect(page.locator('[data-filter-cat]:visible')).toHaveCount(all)
})

test('Kalender: Monatsansicht umschalten und blättern', async ({ page }) => {
  await page.goto('/kalender/')
  const cal = page.locator('[data-cal]').first()
  const monthBtn = cal.locator('[data-view="month"]')
  await monthBtn.click()
  await expect(monthBtn).toHaveAttribute('aria-pressed', 'true')
  await expect(cal.locator('[data-cal-month]')).toBeVisible()
  await expect(cal.locator('[data-cal-list]')).toBeHidden()

  const label = cal.locator('[data-cal-label]')
  const before = await label.textContent()
  await cal.locator('[data-cal-next]').click()
  await expect(label).not.toHaveText(before ?? '')
  await cal.locator('[data-cal-prev]').click()
  await expect(label).toHaveText(before ?? '')
})

test('Spenden: IBAN per Knopf in die Zwischenablage kopieren', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/spenden/')
  const btn = page.locator('[data-copy^="DE"]')
  const iban = await btn.getAttribute('data-copy')
  await btn.click()
  await expect(btn.locator('[data-copy-label]')).toHaveText('Kopiert')
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(iban)
})

test('Suche per Tastatur: „/“ öffnet, Pfeil runter + Enter öffnet den Treffer', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Tastatur-Kürzel sind für den Desktop gedacht')
  await page.goto('/')
  await page.keyboard.press('/')
  const input = page.locator('[data-search-input]')
  await expect(input).toBeFocused()
  await input.fill('darts')
  await expect(page.locator('.svh-search__result').first()).toBeVisible()
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/sport\/darts\/$/)
})

test('Suchseite übernimmt den Suchbegriff aus der Adresse', async ({ page }) => {
  await page.goto('/suche/?q=satzung')
  await expect(page.locator('a', { hasText: 'Vereinssatzung' }).first()).toBeVisible()
})

test('Skip-Link springt zum Inhalt', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Tastatur-Bedienung')
  await page.goto('/verein/')
  await page.keyboard.press('Tab')
  const skip = page.locator('.svh-skip-link')
  await expect(skip).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#svh-main')).toBeFocused()
})

test('Mobile-Menü: Untermenü auf- und zuklappen', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'nur unter 1101 px')
  await page.goto('/')
  await page.locator('[data-mnav-open]').click()
  const toggle = page.locator('[data-mnav-toggle]').first()
  const sub = page.locator(`#${await toggle.getAttribute('aria-controls')}`)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(sub).toHaveClass(/is-open/)
  await expect(sub.locator('a').first()).toBeVisible()
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
})

test('„Nach oben“ erscheint beim Scrollen und bringt zurück zum Anfang', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/verein/')
  await page.mouse.wheel(0, 4000)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000)
  const totop = page.locator('[data-totop]')
  await expect(totop).toBeVisible()
  await totop.click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
})
