/* Gemeinsame Suchlogik (Overlay + Suchseite) */
export function normalize(s = '') {
  return String(s)
    .toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function searchIndex(index, query, limit = 12) {
  const q = normalize(query)
  if (q.length < 2) return []
  const tokens = q.split(' ').filter(Boolean)
  const out = []
  for (const item of index) {
    let score = 0
    let all = true
    for (const t of tokens) {
      let s = 0
      if (item.nt.includes(t)) s += 6
      if (item.nt.startsWith(t) || item.nt.includes(` ${t}`)) s += 3
      if (item.n.includes(t)) s += 2
      if (!s) {
        all = false
        break
      }
      score += s
    }
    if (!all) continue
    if (item.n.includes(q)) score += 3
    out.push({ item, score })
  }
  return out
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map((r) => r.item)
}

export function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

let cache = null
export function loadIndex(url = '/suche.json') {
  /* Vorschau-Datei ohne Server: Index ist direkt eingebettet */
  if (typeof window !== 'undefined' && Array.isArray(window.SVH_INDEX)) return Promise.resolve(window.SVH_INDEX)
  if (!cache) {
    cache = fetch(url)
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => [])
  }
  return cache
}

/* Für die Vorschau-Version (relative Pfade): Basis-Pfad voranstellen */
export function hrefFor(url) {
  const root = typeof window !== 'undefined' ? window.SVH_ROOT : undefined
  return root && !/^(\/|https?:|mailto:|tel:)/.test(url) ? root + url : url
}
