/* =========================================================
   Termin-Details (Modal) + Kalendereintrag (.ics)
   ========================================================= */
import { trapFocus } from './a11y.js'
import { buildIcs } from './ics.js'

const modal = document.querySelector('[data-event-modal]')
const dataEl = document.getElementById('svh-events-data')
const events = dataEl ? JSON.parse(dataEl.textContent || '{}') : {}
let returnFocus = null
let current = null

const $ = (sel) => modal?.querySelector(sel)

export function openEvent(id) {
  const ev = events[id]
  if (!modal || !ev) return
  current = ev
  returnFocus = document.activeElement
  $('[data-m-type]').textContent = ev.typeLabel
  $('[data-m-type]').style.background = ''
  $('[data-m-title]').textContent = ev.title
  $('[data-m-date]').textContent = ev.dateLabel
  $('[data-m-time]').textContent = ev.timeLabel || 'Uhrzeit folgt'
  $('[data-m-location]').textContent = ev.location || 'Ort folgt'
  $('[data-m-desc]').textContent = ev.description || ''
  const note = $('[data-m-note]')
  note.hidden = !ev.note
  note.querySelector('span').textContent = ev.note || ''
  const route = $('[data-m-route]')
  route.hidden = !ev.mapsUrl
  if (ev.mapsUrl) route.href = ev.mapsUrl
  const link = $('[data-m-link]')
  link.hidden = !ev.url
  if (ev.url) link.href = ev.url
  modal.inert = false
  modal.classList.add('is-open')
  document.body.classList.add('svh-no-scroll')
  setTimeout(() => $('.svh-modal__close')?.focus(), 40)
}

function closeModal() {
  if (!modal?.classList.contains('is-open')) return
  modal.classList.remove('is-open')
  modal.inert = true
  document.body.classList.remove('svh-no-scroll')
  returnFocus?.focus?.({ preventScroll: true })
}

if (modal) {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-event-id]')
    if (trigger && events[trigger.dataset.eventId]) {
      e.preventDefault()
      openEvent(trigger.dataset.eventId)
    }
  })
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.closest('[data-m-close]')) closeModal()
  })
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return
    if (e.key === 'Escape') closeModal()
    else trapFocus(modal.querySelector('.svh-modal__card'), e)
  })
  $('[data-m-ics]')?.addEventListener('click', () => {
    if (!current) return
    const blob = new Blob([buildIcs(current)], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${current.id}.ics`
    document.body.append(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  })
}
