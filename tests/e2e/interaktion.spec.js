/* Wichtige Abläufe aus Besuchersicht: Menü, Suche, Termin + Kalenderdatei, 2-Klick-Einbettung,
   Weiterleitungen alter Adressen. */
import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

test('Mobile-Menü öffnet, hält den Fokus und schließt mit Escape', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Burger-Menü gibt es nur unter 1101 px')
  await page.goto('/')
  const burger = page.locator('[data-mnav-open]')
  const nav = page.locator('[data-mnav]')

  await burger.click()
  await expect(nav).toHaveClass(/is-open/)
  await expect(burger).toHaveAttribute('aria-expanded', 'true')
  await expect(nav.locator('.svh-mnav__close')).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(nav).not.toHaveClass(/is-open/)
  await expect(burger).toHaveAttribute('aria-expanded', 'false')
  await expect(burger).toBeFocused()
})

test('Suche findet „Bogenschießen“ auch ohne ß und führt zur Abteilung', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-search-open]').first().click()
  const input = page.locator('[data-search-input]')
  await expect(input).toBeFocused()

  await input.fill('bogenschiessen')
  const hit = page.locator('.svh-search__result', { hasText: 'Bogenschießen' }).first()
  await expect(hit).toBeVisible()
  await hit.click()
  await expect(page).toHaveURL(/\/sport\/bogenschiessen\/$/)
})

test('Termin öffnet Details und lädt eine gültige Kalenderdatei', async ({ page }) => {
  await page.goto('/termine/')
  const card = page.locator('[data-event-id]').first()
  const id = await card.getAttribute('data-event-id')
  await card.click()

  const modal = page.locator('[data-event-modal]')
  await expect(modal).toHaveClass(/is-open/)
  await expect(modal.locator('[data-m-title]')).not.toBeEmpty()

  const [download] = await Promise.all([page.waitForEvent('download'), modal.locator('[data-m-ics]').click()])
  expect(download.suggestedFilename()).toBe(`${id}.ics`)
  const ics = await readFile(await download.path(), 'utf8')
  expect(ics).toMatch(/^BEGIN:VCALENDAR\r\n/)
  expect(ics).toContain(`UID:${id}@sv-hochhausen-1946`)
  expect(ics).toMatch(/\r\nEND:VCALENDAR$/)

  await page.keyboard.press('Escape')
  await expect(modal).not.toHaveClass(/is-open/)
})

test('Facebook lädt erst nach Klick (2-Klick-Lösung)', async ({ page }) => {
  // Nichts wirklich an Facebook senden – nur prüfen, dass der Aufruf erst nach dem Klick entsteht
  const calls = []
  await page.route(/facebook\.com/, (route) => {
    calls.push(route.request().url())
    return route.abort()
  })
  await page.goto('/')
  const box = page.locator('[data-embed="facebook"]')
  await expect(box.locator('iframe')).toHaveCount(0)
  expect(calls).toEqual([])

  await box.locator('[data-embed-load]').click()
  await expect(box.locator('iframe[src*="facebook.com/plugins/page.php"]')).toHaveCount(1)
})

for (const [from, to] of [
  ['/der-verein/', '/verein/'],
  ['/sportarten/bogenschießen/', '/sport/bogenschiessen/'],
  ['/partner/', '/sponsoren/'],
]) {
  test(`alte Adresse ${from} leitet auf ${to} weiter`, async ({ page }) => {
    await page.goto(encodeURI(from))
    await expect(page).toHaveURL(new RegExp(`${to.replace(/\//g, '\\/')}$`))
    await expect(page.locator('h1').first()).toBeVisible()
  })
}
