/* =========================================================
   Termin-Details (Modal) + Kalendereintrag (.ics)
   ========================================================= */
import { trapFocus } from './a11y.js'

const modal = document.querySelector('[data-event-modal]')
const dataEl = document.getElementById('svh-events-data')
const events = dataEl ? JSON.parse(dataEl.textContent || '{}') : {}
let returnFocus = null
let current = null

const $ = (sel) => modal?.querySelector(sel)

function icsEscape(s = '') {
  return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}
function pad(n) {
  return String(n).padStart(2, '0')
}
function buildIcs(ev) {
  const [y, m, d] = ev.date.split('-').map(Number)
  const t = (ev.time || '').match(/(\d{1,2}):(\d{2})/)
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')
  let start
  let end
  if (t) {
    const s = new Date(y, m - 1, d, Number(t[1]), Number(t[2]))
    const e = new Date(s.getTime() + (ev.durationMin || 120) * 60000)
    const f = (x) => `${x.getFullYear()}${pad(x.getMonth() + 1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`
    start = `DTSTART:${f(s)}`
    end = `DTEND:${f(e)}`
  } else {
    const next = new Date(y, m - 1, d + 1)
    start = `DTSTART;VALUE=DATE:${y}${pad(m)}${pad(d)}`
    end = `DTEND;VALUE=DATE:${next.getFullYear()}${pad(next.getMonth() + 1)}${pad(next.getDate())}`
  }
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SV Hochhausen 1946//Website//DE',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${ev.id}@sv-hochhausen-1946`,
    `DTSTAMP:${stamp}`,
    start,
    end,
    `SUMMARY:${icsEscape(ev.title)}`,
    `LOCATION:${icsEscape(ev.location || '')}`,
    `DESCRIPTION:${icsEscape(ev.description || '')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

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
