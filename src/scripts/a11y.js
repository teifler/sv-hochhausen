/* Fokusfalle für Dialoge (Tab bleibt im Dialog) */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])'

export function trapFocus(container, e) {
  if (!container || e.key !== 'Tab') return
  const items = [...container.querySelectorAll(FOCUSABLE)].filter(
    (el) => el.getClientRects().length && !el.closest('[inert]'),
  )
  if (!items.length) return
  const first = items[0]
  const last = items[items.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}
