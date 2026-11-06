/* =========================================================
   Galerie-Lightbox (Tastatur, Wischen, Zähler)
   ========================================================= */
import { trapFocus } from './a11y.js'

const grid = document.querySelector('[data-gallery]')
const lb = document.querySelector('[data-lightbox]')

if (grid && lb) {
  const img = lb.querySelector('[data-lb-img]')
  const title = lb.querySelector('[data-lb-title]')
  const cat = lb.querySelector('[data-lb-cat]')
  const count = lb.querySelector('[data-lb-count]')
  const desc = lb.querySelector('[data-lb-desc]')
  const link = lb.querySelector('[data-lb-link]')
  let list = []
  let idx = 0
  let returnFocus = null

  function show(i) {
    idx = (i + list.length) % list.length
    const it = list[idx]
    img.src = it.dataset.full
    img.alt = it.dataset.title || ''
    title.textContent = it.dataset.title || ''
    cat.textContent = it.dataset.cat || ''
    if (desc) desc.textContent = it.dataset.desc || ''
    if (link) {
      link.hidden = !it.dataset.href
      if (it.dataset.href) link.href = it.dataset.href
    }
    count.textContent = `${idx + 1} / ${list.length}`
  }
  function open(item) {
    list = [...grid.querySelectorAll('[data-gallery-item]')].filter((x) => !x.hidden)
    returnFocus = item
    show(list.indexOf(item))
    lb.inert = false
    lb.classList.add('is-open')
    document.body.classList.add('svh-no-scroll')
    setTimeout(() => lb.querySelector('[data-lb-close]')?.focus(), 40)
  }
  function close() {
    lb.classList.remove('is-open')
    lb.inert = true
    document.body.classList.remove('svh-no-scroll')
    returnFocus?.focus?.({ preventScroll: true })
  }

  grid.addEventListener('click', (e) => {
    const item = e.target.closest('[data-gallery-item]')
    if (item) open(item)
  })
  lb.querySelector('[data-lb-close]').addEventListener('click', close)
  lb.querySelector('[data-lb-prev]').addEventListener('click', () => show(idx - 1))
  lb.querySelector('[data-lb-next]').addEventListener('click', () => show(idx + 1))
  lb.addEventListener('click', (e) => {
    if (e.target === lb) close()
  })
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return
    if (e.key === 'Escape') close()
    else if (e.key === 'ArrowLeft') show(idx - 1)
    else if (e.key === 'ArrowRight') show(idx + 1)
    else trapFocus(lb, e)
  })
  let x0 = null
  lb.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true })
  lb.addEventListener(
    'touchend',
    (e) => {
      if (x0 === null) return
      const dx = e.changedTouches[0].clientX - x0
      if (Math.abs(dx) > 45) show(idx + (dx < 0 ? 1 : -1))
      x0 = null
    },
    { passive: true },
  )
}
