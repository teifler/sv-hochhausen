/* =========================================================
   Micro-Interactions: Bilder einblenden, Scroll-Fortschritt,
   Zähler, Spotlight, „Heute“ im Wochenplan, Countdown, Parallax
   ========================================================= */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const root = document.documentElement

/* Bilder weich einblenden, sobald geladen */
function markLoaded(img) {
  img.classList.add('is-loaded')
}
document.querySelectorAll('img.svh-img').forEach((img) => {
  if (img.complete && img.naturalWidth > 0) markLoaded(img)
  else {
    img.addEventListener('load', () => markLoaded(img), { once: true })
    img.addEventListener('error', () => markLoaded(img), { once: true })
  }
})

/* Scroll-Fortschritt (Header-Leiste + Ring am Nach-oben-Button) */
let ticking = false
function progress() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  root.style.setProperty('--svh-p', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : '0')
  ticking = false
}
window.addEventListener(
  'scroll',
  () => {
    if (!ticking) {
      requestAnimationFrame(progress)
      ticking = true
    }
  },
  { passive: true },
)
window.addEventListener('resize', progress, { passive: true })
progress()

/* Zähler hochzählen, wenn sichtbar */
const counters = document.querySelectorAll('[data-count]')
if (counters.length && 'IntersectionObserver' in window && !reduce) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return
        io.unobserve(en.target)
        const el = en.target
        const target = Number(el.dataset.count)
        const start = performance.now()
        const dur = 1300
        const step = (now) => {
          const t = Math.min(1, (now - start) / dur)
          el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))))
          if (t < 1) requestAnimationFrame(step)
          else el.textContent = el.dataset.countText || String(target)
        }
        requestAnimationFrame(step)
      }),
    { threshold: 0.4 },
  )
  counters.forEach((c) => io.observe(c))
}

/* Spotlight folgt dem Mauszeiger auf Karten */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const SEL = '.svh-info-card, .svh-partner-card, .svh-person-card, a.svh-contact-item'
  document.addEventListener(
    'pointermove',
    (e) => {
      const card = e.target.closest?.(SEL)
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    },
    { passive: true },
  )
}

/* Wochenplan: heutigen Tag hervorheben */
const today = new Date().getDay()
document.querySelectorAll(`[data-weekday="${today}"]`).forEach((d) => d.classList.add('is-today'))

/* Countdown bis zum nächsten Spiel/Termin */
document.querySelectorAll('[data-countdown]').forEach((el) => {
  const [d, t = '00:00'] = el.dataset.countdown.split('T')
  const [y, m, day] = d.split('-').map(Number)
  const [hh, mm] = t.split(':').map(Number)
  const target = new Date(y, m - 1, day, hh, mm)
  const now = new Date()
  const days = Math.round(
    (new Date(y, m - 1, day) - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000,
  )
  if (target < now) return
  el.textContent = days === 0 ? 'Heute' : days === 1 ? 'Morgen' : `In ${days} Tagen`
})

/* Sanftes Parallax für Hintergrundbilder */
const para = [...document.querySelectorAll('[data-parallax]')]
if (para.length && !reduce) {
  let pending = false
  const SCALE = 1.12 // Bild ist 6 % pro Seite größer als sein Rahmen …
  const update = () => {
    const vh = window.innerHeight
    for (const el of para) {
      const r = el.parentElement.getBoundingClientRect()
      if (r.bottom < -80 || r.top > vh + 80) continue
      /* t: -1 (Rahmen unten im Bild) … +1 (Rahmen oben raus) */
      const t = Math.max(-1, Math.min(1, (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2)))
      /* … daher höchstens 90 % dieses Rands verschieben: nie sichtbare Kanten */
      const shift = t * ((SCALE - 1) / 2) * r.height * 0.9
      el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0) scale(${SCALE})`
    }
    pending = false
  }
  window.addEventListener(
    'scroll',
    () => {
      if (!pending) {
        requestAnimationFrame(update)
        pending = true
      }
    },
    { passive: true },
  )
  window.addEventListener('resize', update, { passive: true })
  update()
}
