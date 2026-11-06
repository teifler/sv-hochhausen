/* =========================================================
   Formulare: Versand per fetch (ohne Neuladen), Fallback =
   normales Absenden. Spamschutz: Honeypot + Zeitstempel.
   ========================================================= */
const OK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><path d="M22 4L12 14.01l-3-3"/></svg>'
const ERR_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>'

const MESSAGES = {
  not_configured:
    'Der E-Mail-Versand ist auf dieser Website noch nicht eingerichtet. Bitte schreib uns direkt an <a href="mailto:info@sportverein-hochhausen.de">info@sportverein-hochhausen.de</a>.',
  invalid: 'Bitte prüfe deine Angaben – ein Pflichtfeld fehlt oder ist ungültig.',
  spam: 'Das ging etwas zu schnell. Bitte warte einen Moment und sende das Formular erneut.',
  send_failed:
    'Die Nachricht konnte gerade nicht gesendet werden. Bitte versuche es später erneut oder schreib an <a href="mailto:info@sportverein-hochhausen.de">info@sportverein-hochhausen.de</a>.',
  network:
    'Keine Verbindung zum Server. Bitte prüfe deine Internetverbindung oder schreib an <a href="mailto:info@sportverein-hochhausen.de">info@sportverein-hochhausen.de</a>.',
}

function setStatus(form, ok, html) {
  const box = form.querySelector('[data-form-status]')
  if (!box) return
  box.innerHTML = `<div class="${ok ? 'svh-form__success' : 'svh-form__error'}">${ok ? OK_ICON : ERR_ICON}<div>${html}</div></div>`
  box.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}

function stamp(form) {
  const ts = form.querySelector('input[name="ts"]')
  if (ts) ts.value = String(Date.now())
}

for (const form of document.querySelectorAll('form[data-ajax-form]')) {
  if (form.dataset.bound) continue
  form.dataset.bound = '1'
  stamp(form)

  /* Anliegen aus der URL vorwählen (?anliegen=sponsoring) */
  const topic = new URLSearchParams(location.search).get('anliegen')
  const sel = form.querySelector('select[name="topic"]')
  if (topic && sel && [...sel.options].some((o) => o.value === topic)) sel.value = topic

  /* Spenden: eigener Betrag & Spendenquittung */
  const otherField = form.querySelector('[data-amount-other-field]')
  const otherInput = otherField?.querySelector('input')
  form.querySelectorAll('input[name="amount"]').forEach((r) =>
    r.addEventListener('change', () => {
      const on = form.querySelector('[data-amount-other]')?.checked
      if (otherField) otherField.hidden = !on
      if (otherInput) {
        otherInput.required = !!on
        if (on) otherInput.focus()
      }
    }),
  )
  const receipt = form.querySelector('[data-receipt-toggle]')
  const receiptFields = form.querySelector('[data-receipt-fields]')
  receipt?.addEventListener('change', () => {
    if (!receiptFields) return
    receiptFields.hidden = !receipt.checked
    receiptFields.querySelectorAll('input').forEach((i) => (i.required = receipt.checked))
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (!form.reportValidity()) return
    /* Vorschau-Version (ohne Server): nichts senden */
    if (window.SVH_PREVIEW) {
      setStatus(form, true, '<strong>Vorschau:</strong> Das Formular funktioniert. Der E-Mail-Versand ist erst auf der veröffentlichten Website aktiv.')
      return
    }
    const btn = form.querySelector('[type="submit"]')
    btn?.setAttribute('disabled', '')
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setStatus(form, true, data.message || 'Danke! Deine Nachricht ist angekommen.')
        form.reset()
        if (otherField) otherField.hidden = true
        if (receiptFields) receiptFields.hidden = true
        stamp(form)
      } else {
        setStatus(form, false, MESSAGES[data.error] || MESSAGES.send_failed)
      }
    } catch {
      setStatus(form, false, MESSAGES.network)
    } finally {
      btn?.removeAttribute('disabled')
    }
  })
}
