/* =========================================================
   2-Klick-Einbettungen (fussball.de, Facebook)
   Externe Inhalte werden erst nach Klick geladen. Optional
   wird die Zustimmung lokal gemerkt (localStorage).
   ========================================================= */
function addScript(old) {
  return new Promise((resolve) => {
    const s = document.createElement('script')
    for (const a of old.attributes) s.setAttribute(a.name, a.value)
    if (old.src) {
      s.async = false
      s.onload = () => resolve()
      s.onerror = () => resolve()
      old.replaceWith(s)
    } else {
      s.textContent = old.textContent
      old.replaceWith(s)
      resolve()
    }
  })
}

async function activate(box) {
  if (box.classList.contains('is-loaded')) return
  box.classList.add('is-loaded')
  box.querySelector('[data-embed-consent]')?.remove()
  for (const slot of box.querySelectorAll('[data-embed-slot]')) {
    const tpl = slot.querySelector('template')
    if (!tpl) continue
    slot.replaceChildren(tpl.content.cloneNode(true))
    for (const old of [...slot.querySelectorAll('script')]) {
      try {
        await addScript(old)
      } catch {}
    }
  }
}

for (const box of document.querySelectorAll('[data-embed]')) {
  const key = `svh-consent-${box.dataset.embed}`
  box.querySelector('[data-embed-load]')?.addEventListener('click', () => {
    try {
      if (box.querySelector('[data-embed-remember]')?.checked) localStorage.setItem(key, '1')
    } catch {}
    activate(box)
  })
  try {
    if (localStorage.getItem(key) === '1') activate(box)
  } catch {}
}
