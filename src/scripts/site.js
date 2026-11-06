/* =========================================================
   Seitenweite Interaktionen (progressiv, ohne Frameworks)
   Header · Mobile-Menü · Suche · Reveal · Nach oben · Filter ·
   Kopieren
   ========================================================= */
import { escapeHtml, hrefFor, loadIndex, searchIndex } from './searchcore.js'
import { trapFocus } from './a11y.js'
import './motion.js'

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const body = document.body

/* ---------- Header & Nach-oben ---------------------------- */
const header = document.querySelector('[data-header]')
const totop = document.querySelector('[data-totop]')
let ticking = false
function onScroll() {
  const y = window.scrollY
  if (header) header.dataset.scrolled = y > 10 ? 'true' : 'false'
  if (totop) totop.classList.toggle('is-visible', y > 700)
  ticking = false
}
window.addEventListener(
  'scroll',
  () => {
    if (!ticking) {
      requestAnimationFrame(onScroll)
      ticking = true
    }
  },
  { passive: true },
)
onScroll()
totop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  document.getElementById('svh-main')?.focus({ preventScroll: true })
})

/* ---------- Mobile-Menü ----------------------------------- */
const mnav = document.querySelector('[data-mnav]')
const burger = document.querySelector('[data-mnav-open]')
let navReturn = null

function openNav() {
  if (!mnav) return
  navReturn = document.activeElement
  mnav.inert = false
  mnav.classList.add('is-open')
  burger?.setAttribute('aria-expanded', 'true')
  burger?.setAttribute('aria-label', 'Menü schließen')
  body.classList.add('svh-no-scroll')
  setTimeout(() => mnav.querySelector('.svh-mnav__close')?.focus(), 50)
}
function closeNav(restore = true) {
  if (!mnav?.classList.contains('is-open')) return
  mnav.classList.remove('is-open')
  mnav.inert = true
  burger?.setAttribute('aria-expanded', 'false')
  burger?.setAttribute('aria-label', 'Menü öffnen')
  body.classList.remove('svh-no-scroll')
  if (restore) (navReturn || burger)?.focus?.({ preventScroll: true })
}
burger?.addEventListener('click', () => (mnav?.classList.contains('is-open') ? closeNav() : openNav()))
mnav?.addEventListener('click', (e) => {
  const t = e.target
  if (t.closest('[data-mnav-close]')) return closeNav()
  const toggle = t.closest('[data-mnav-toggle]')
  if (toggle) {
    const sub = document.getElementById(toggle.getAttribute('aria-controls'))
    const open = toggle.getAttribute('aria-expanded') !== 'true'
    toggle.setAttribute('aria-expanded', String(open))
    if (sub) {
      sub.classList.toggle('is-open', open)
      sub.inert = !open
    }
    return
  }
  if (t.closest('a[href]')) closeNav(false)
})
mnav?.addEventListener('keydown', (e) => trapFocus(mnav.querySelector('.svh-mnav__panel'), e))
/* Untermenü mit der aktuellen Seite aufklappen */
mnav?.querySelectorAll('.svh-mnav__sub').forEach((sub) => {
  if (sub.querySelector('.is-active')) {
    sub.classList.add('is-open')
    sub.inert = false
    mnav.querySelector(`[aria-controls="${sub.id}"]`)?.setAttribute('aria-expanded', 'true')
  }
})
/* Beim Wechsel auf Desktop-Breite schließen */
window.matchMedia('(min-width: 1101px)').addEventListener?.('change', (m) => m.matches && closeNav(false))

/* ---------- Suche (Overlay) ------------------------------- */
const search = document.querySelector('[data-search]')
const input = search?.querySelector('[data-search-input]')
const results = search?.querySelector('[data-search-results]')
let searchReturn = null
let activeIndex = -1
let lastHits = []

function renderHits(hits, q) {
  lastHits = hits
  activeIndex = -1
  if (!results) return
  if (!q || q.trim().length < 2) {
    results.innerHTML =
      '<p class="svh-search__empty">Tippe einen Suchbegriff ein – z. B. „Darts“, „Maiwanderung“ oder „Satzung“.</p>'
    return
  }
  if (!hits.length) {
    results.innerHTML = `<p class="svh-search__empty">Keine Treffer für „${escapeHtml(q)}“. <a href="/kontakt/">Frag uns direkt</a>.</p>`
    return
  }
  results.innerHTML = hits
    .map(
      (h, i) =>
        `<a class="svh-search__result" href="${escapeHtml(hrefFor(h.url))}" data-i="${i}">` +
        `<span class="svh-search__result-top"><span class="svh-badge svh-badge--muted">${escapeHtml(h.type)}</span><b>${escapeHtml(h.title)}</b></span>` +
        (h.meta ? `<small>${escapeHtml(h.meta)}</small>` : '') +
        `</a>`,
    )
    .join('')
}
function setActive(i) {
  const links = results ? [...results.querySelectorAll('.svh-search__result')] : []
  if (!links.length) return
  activeIndex = (i + links.length) % links.length
  links.forEach((l, k) => l.classList.toggle('is-active', k === activeIndex))
  links[activeIndex].scrollIntoView({ block: 'nearest' })
}
async function runSearch() {
  const q = input.value
  const index = await loadIndex(search.dataset.searchUrl)
  if (q !== input.value) return
  renderHits(searchIndex(index, q, 10), q)
}
function openSearch() {
  if (!search) return
  closeNav(false)
  searchReturn = document.activeElement
  search.inert = false
  search.classList.add('is-open')
  body.classList.add('svh-no-scroll')
  loadIndex(search.dataset.searchUrl)
  setTimeout(() => input?.focus(), 60)
}
function closeSearch() {
  if (!search?.classList.contains('is-open')) return
  search.classList.remove('is-open')
  search.inert = true
  body.classList.remove('svh-no-scroll')
  searchReturn?.focus?.({ preventScroll: true })
}
document.querySelectorAll('[data-search-open]').forEach((b) => b.addEventListener('click', openSearch))
search?.addEventListener('click', (e) => {
  if (e.target === search || e.target.closest('[data-search-close]')) closeSearch()
})
search?.addEventListener('keydown', (e) => trapFocus(search, e))
input?.addEventListener('input', runSearch)
input?.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    setActive(activeIndex + 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    setActive(activeIndex - 1)
  } else if (e.key === 'Enter' && lastHits.length) {
    e.preventDefault()
    window.location.href = hrefFor(lastHits[Math.max(activeIndex, 0)].url)
  }
})

/* ---------- Globale Tasten -------------------------------- */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSearch()
    closeNav()
  }
  const typing = /input|textarea|select/i.test(e.target?.tagName || '') || e.target?.isContentEditable
  if (((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) && search) {
    e.preventDefault()
    openSearch()
  }
})

/* ---------- Reveal beim Scrollen -------------------------- */
const reveals = document.querySelectorAll('.svh-reveal')
if ('IntersectionObserver' in window && reveals.length && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible')
          io.unobserve(en.target)
        }
      }),
    { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
  )
  reveals.forEach((el) => io.observe(el))
  /* Druck/Anker-Sprünge: alles sichtbar machen */
  window.addEventListener('beforeprint', () => reveals.forEach((el) => el.classList.add('is-visible')))
} else {
  reveals.forEach((el) => el.classList.add('is-visible'))
}

/* ---------- Filter-Chips (News, Galerie, Kalender) -------- */
document.querySelectorAll('[data-filter-group]').forEach((group) => {
  const target = document.querySelector(group.dataset.filterTarget)
  const empty = group.dataset.filterEmpty ? document.querySelector(group.dataset.filterEmpty) : null
  const chips = [...group.querySelectorAll('[data-filter-value]')]
  chips.forEach((chip) =>
    chip.addEventListener('click', () => {
      const v = chip.dataset.filterValue
      chips.forEach((c) => {
        c.classList.toggle('is-active', c === chip)
        c.setAttribute('aria-pressed', c === chip ? 'true' : 'false')
      })
      let shown = 0
      target?.querySelectorAll('[data-filter-cat]').forEach((item) => {
        const ok = v === 'alle' || item.dataset.filterCat.split('|').includes(v)
        item.hidden = !ok
        if (ok) shown++
      })
      target?.querySelectorAll('[data-filter-section]').forEach((sec) => {
        sec.hidden = !sec.querySelector('[data-filter-cat]:not([hidden])')
      })
      if (empty) empty.hidden = shown > 0
      target?.dispatchEvent(new CustomEvent('svh:filter', { detail: { value: v } }))
    }),
  )
})

/* ---------- In Zwischenablage kopieren -------------------- */
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-copy]')
  if (!btn) return
  const text = btn.dataset.copy
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'absolute'
    ta.style.left = '-9999px'
    document.body.append(ta)
    ta.select()
    try {
      document.execCommand('copy')
    } catch {}
    ta.remove()
  }
  const label = btn.querySelector('[data-copy-label]')
  const before = label?.textContent
  btn.classList.add('is-done')
  if (label) label.textContent = 'Kopiert'
  setTimeout(() => {
    btn.classList.remove('is-done')
    if (label && before) label.textContent = before
  }, 1800)
})
