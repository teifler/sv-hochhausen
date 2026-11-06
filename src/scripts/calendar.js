/* =========================================================
   Vereinskalender: Liste ↔ Monatsansicht, Filter, Trainings
   ========================================================= */
const root = document.querySelector('[data-cal]')
const dataEl = document.getElementById('svh-cal-data')

if (root && dataEl) {
  const data = JSON.parse(dataEl.textContent || '{}')
  const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
  const views = root.querySelector('[data-cal-views]')
  const monthNav = root.querySelector('[data-cal-monthnav]')
  const list = root.querySelector('[data-cal-list]')
  const month = root.querySelector('[data-cal-month]')
  const body = root.querySelector('[data-cal-body]')
  const label = root.querySelector('[data-cal-label]')
  const hint = root.querySelector('[data-cal-hint]')
  const empty = document.getElementById('cal-empty')

  let filter = 'alle'
  let view = 'list'
  const [ty, tm] = data.today.split('-').map(Number)
  let cur = new Date(ty, tm - 1, 1)

  const pad = (n) => String(n).padStart(2, '0')
  const key = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

  views.hidden = false

  function renderMonth() {
    const y = cur.getFullYear()
    const m = cur.getMonth()
    label.textContent = `${MONTHS[m]} ${y}`
    const first = new Date(y, m, 1)
    const offset = (first.getDay() + 6) % 7
    const start = new Date(y, m, 1 - offset)
    const cells = []
    let eventsInMonth = 0
    for (let i = 0; i < 42; i++) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
      const k = key(d)
      const out = d.getMonth() !== m
      if (i >= 35 && out) break
      let html = `<div class="svh-cal-cell${out ? ' svh-cal-cell--out' : ''}${k === data.today ? ' svh-cal-cell--today' : ''}"><span class="svh-cal-cell__day">${d.getDate()}</span>`
      for (const ev of data.events.filter((e) => e.date === k && (filter === 'alle' || filter === e.type))) {
        if (!out) eventsInMonth++
        const t = data.types[ev.type] || { color: 'var(--svh-red)', label: '' }
        html += `<button type="button" class="svh-cal-ev" data-event-id="${esc(ev.id)}" style="--dot:${t.color}" title="${esc(ev.title)}"><span class="svh-cal-ev__dot"></span><span class="svh-cal-ev__label">${ev.time ? esc(ev.time) + ' ' : ''}${esc(ev.title)}</span></button>`
      }
      if (!out && (filter === 'alle' || filter === 'training')) {
        for (const t of data.trainings.filter((x) => x.day === d.getDay())) {
          html += `<a class="svh-cal-ev svh-cal-ev--training" href="${esc(t.to)}" style="--dot:${data.types.training.color}" title="Training ${esc(t.sport)}"><span class="svh-cal-ev__dot"></span><span class="svh-cal-ev__label">${esc(t.time.split('–')[0])} ${esc(t.sport)}</span></a>`
        }
      }
      cells.push(html + '</div>')
    }
    body.innerHTML = cells.join('')

    /* Hinweis auf den nächsten Termin, wenn der Monat leer ist */
    if (!eventsInMonth) {
      const monthEnd = key(new Date(y, m + 1, 0))
      const next = data.events.find((e) => e.date > monthEnd && (filter === 'alle' || filter === e.type))
      hint.hidden = false
      hint.querySelector('span').textContent = next
        ? `Keine Veranstaltung in diesem Monat. Nächster Termin: ${next.title} am ${Number(next.date.slice(8))}. ${MONTHS[Number(next.date.slice(5, 7)) - 1]} ${next.date.slice(0, 4)}.`
        : 'Keine Veranstaltung in diesem Monat.'
    } else hint.hidden = true
  }

  function setView(v) {
    view = v
    views.querySelectorAll('[data-view]').forEach((b) => {
      const on = b.dataset.view === v
      b.classList.toggle('is-active', on)
      b.setAttribute('aria-pressed', String(on))
    })
    list.hidden = v !== 'list'
    month.hidden = v !== 'month'
    monthNav.hidden = v !== 'month'
    if (empty) {
      const rows = list.querySelectorAll('[data-filter-cat]')
      empty.hidden = v === 'month' || !rows.length || !!list.querySelector('[data-filter-cat]:not([hidden])')
    }
    if (v === 'month') renderMonth()
    try {
      sessionStorage.setItem('svh-cal-view', v)
    } catch {}
  }

  views.addEventListener('click', (e) => {
    const b = e.target.closest('[data-view]')
    if (b) setView(b.dataset.view)
  })
  root.querySelector('[data-cal-prev]')?.addEventListener('click', () => {
    cur = new Date(cur.getFullYear(), cur.getMonth() - 1, 1)
    renderMonth()
  })
  root.querySelector('[data-cal-next]')?.addEventListener('click', () => {
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1)
    renderMonth()
  })
  list.addEventListener('svh:filter', (e) => {
    filter = e.detail.value
    if (view === 'month') {
      if (empty) empty.hidden = true
      renderMonth()
    }
  })

  try {
    if (sessionStorage.getItem('svh-cal-view') === 'month') setView('month')
  } catch {}
}
