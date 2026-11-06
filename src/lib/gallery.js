/* =========================================================
   Galerie-Einträge: echte Vereinsfotos + Instagram-Beiträge
   ========================================================= */
import { ownPhotos, optimizeOwn } from './photos.js'
import { instagramRaw } from './instagram.js'
import { photoInfo, themeCategory, categoryOrder } from '../data/gallery.js'

const short = (s = '', n = 90) => (s.length > n ? `${s.slice(0, n - 1).trim()}…` : s)

function ownEntries() {
  return ownPhotos().map((p) => {
    const info = photoInfo[p.name] || {}
    const theme = p.name.split('-')[0]
    const category = info.category || themeCategory[theme] || 'Vereinsleben'
    return {
      id: `foto-${p.name}`,
      kind: 'own',
      meta: p.meta,
      title: info.title || category,
      caption: info.caption || '',
      category,
      date: info.date || '',
      source: info.source || '',
    }
  })
}

function instagramEntries() {
  return instagramRaw().map((p) => ({
    id: `ig-${p.id}`,
    kind: 'instagram',
    meta: p.meta,
    title: short(p.caption) || 'Instagram-Beitrag',
    caption: p.caption ? short(p.caption, 200) : '',
    category: 'Instagram',
    date: String(p.timestamp || '').slice(0, 10),
    href: p.permalink,
    source: 'Instagram',
  }))
}

/**
 * Alle Galerie-Einträge, neueste zuerst (Instagram vor Archiv).
 * @param {{limit?: number, thumbWidth?: number, fullWidth?: number}} o
 */
export async function galleryItems({ limit = Infinity, thumbWidth = 600, fullWidth = 1600 } = {}) {
  const own = ownEntries().sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id))
  const list = [...instagramEntries(), ...own].slice(0, limit)
  return Promise.all(
    list.map(async (it) => {
      const thumb = await optimizeOwn(it.meta, { width: thumbWidth, widths: [Math.round(thumbWidth / 2), thumbWidth] })
      const full = await optimizeOwn(it.meta, { width: fullWidth, widths: [fullWidth] })
      const { meta, ...rest } = it
      return { ...rest, src: thumb.src, srcset: thumb.srcset, width: thumb.width, height: thumb.height, full: full.src }
    }),
  )
}

/** Filter-Kategorien in fester Reihenfolge, nur vorhandene */
export function galleryCategories(items) {
  const present = new Set(items.map((i) => i.category))
  return ['Alle', ...categoryOrder.filter((c) => present.has(c)), ...[...present].filter((c) => !categoryOrder.includes(c))]
}
