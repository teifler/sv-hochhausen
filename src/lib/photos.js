/* =========================================================
   Foto-Auflösung
   ---------------------------------------------------------
   Reihenfolge: echte Vereinsfotos (src/assets/photos/<thema>…)
   > wenige Stockfotos (lib/pexels.js) > gezeichnete Grafik
   (lib/placeholder.js, übernimmt Pic.astro bei null).

   Regeln:
   - Jedes Foto höchstens einmal pro Seite (usedOnPage).
     Sind alle Fotos eines Themas vergeben → Grafik statt Wiederholung.
   - Größen-Check: Ein Foto wird nur genutzt, wenn es mindestens
     60 % der angeforderten Breite hat (kleine Archivbilder landen
     so nur in kleinen Kacheln und in der Galerie – nie unscharf groß).
   - „-poster“ im Dateinamen = Bild mit eingebrannter Schrift/Logos
     (z. B. Mannschaftsfoto mit Namensliste): nie als Hintergrund
     oder unter Text (Pic clean), aber gern in Karten und Galerie.

   Bilder werden von Astro (sharp) beim Build in WebP + srcset
   umgerechnet und lokal ausgeliefert.
   ========================================================= */
import { getImage } from 'astro:assets'
import { PEXELS, THEME_ALIASES, pexelsUrl } from './pexels.js'

const files = import.meta.glob('/src/assets/photos/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
})

const byName = {}
for (const [path, meta] of Object.entries(files)) {
  const name = path
    .split('/')
    .pop()
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
  byName[name] = meta
}

/* Nur für Vorschau-Builds: Stockfotos direkt vom CDN laden statt lokal
   (SVH_HOTLINK=1). Die echte Website liefert alle Bilder selbst aus. */
const HOTLINK = typeof process !== 'undefined' && process.env?.SVH_HOTLINK === '1'

export function themeKey(theme) {
  return PEXELS[theme] ? theme : THEME_ALIASES[theme] || theme
}

const isPoster = (name) => /(^|-)poster(-|$)/.test(name)

/** Alle eigenen Vereinsfotos (für Galerie & Co.), alphabetisch. */
export function ownPhotos() {
  return Object.keys(byName)
    .filter((n) => !n.startsWith('pexels-'))
    .sort()
    .map((name) => ({ name, meta: byName[name], poster: isPoster(name) }))
}

/* Kandidaten für ein Thema in Prioritätsreihenfolge */
function candidates(theme, seed, { clean, minWidth }) {
  const t = themeKey(theme)
  /* Bestes zuerst: eigene Fotos nach Größe, Stockfotos in der kuratierten
     Reihenfolge aus pexels.js. Vielfalt entsteht über „einmal pro Seite“. */
  const bySize = (a, b) => b.meta.width - a.meta.width || a.name.localeCompare(b.name)
  const own = ownPhotos().filter((p) => (p.name === t || p.name.startsWith(`${t}-`)) && p.meta.width >= minWidth)
  const plain = own.filter((p) => !p.poster).sort(bySize)
  /* Plakate (Mannschaftsfotos mit Schrift): neueste Saison zuerst */
  const posters = clean ? [] : own.filter((p) => p.poster).sort((a, b) => b.name.localeCompare(a.name))
  const ownOrdered = [...posters, ...plain].map((p) => ({ key: `own:${p.name}`, own: true, meta: p.meta }))
  const stock = (PEXELS[t] || [])
    .map((id) => ({ key: `pexels:${id}`, own: false, id, meta: byName[`pexels-${id}`] || null }))
    .filter((c) => HOTLINK || c.meta)
  return [...ownOrdered, ...stock]
}

/* Keine Doppelungen auf einer Seite: pro Seitenaufruf (Astro.request)
   merken, welche Fotos schon vorkommen. */
const usedByPage = new WeakMap()
export function usedOnPage(request) {
  if (!request || typeof request !== 'object') return null
  let set = usedByPage.get(request)
  if (!set) usedByPage.set(request, (set = new Set()))
  return set
}

const cache = new Map()

/** Eigenes Foto (Astro-Asset) optimieren → { src, srcset, width, height } */
export async function optimizeOwn(meta, { width = 1200, widths, quality = 72 } = {}) {
  const w = Math.min(width, meta.width)
  const ws = (widths || [Math.round(w / 2), w])
    .map((x) => Math.min(x, meta.width))
    .filter((x, i, a) => a.indexOf(x) === i)
  const key = `${meta.src}|${w}|${ws.join(',')}|${quality}`
  if (cache.has(key)) return cache.get(key)
  const img = await getImage({ src: meta, width: w, widths: ws, format: 'webp', quality })
  const result = {
    src: img.src,
    srcset: img.srcSet?.attribute || '',
    width: w,
    height: Math.round((meta.height / meta.width) * w),
  }
  cache.set(key, result)
  return result
}

/**
 * Optimiertes Foto für ein Thema oder null (→ Grafik).
 * @param {object} o  width/widths/quality, avoid (Set aus usedOnPage), clean (kein Poster)
 */
export async function optimizedPhoto(
  theme,
  seed = 0,
  { width = 1200, widths, quality = 70, avoid = null, clean = false, minScale = 0.6 } = {},
) {
  const s = Math.abs(Number(seed) || 0)
  const list = candidates(theme, s, { clean, minWidth: Math.round(width * minScale) })
  const pick = list.find((c) => !avoid || !avoid.has(c.key))
  if (!pick) return null
  avoid?.add(pick.key)
  if (pick.own) return { ...(await optimizeOwn(pick.meta, { width, widths, quality })), own: true }
  if (HOTLINK && !pick.meta) {
    const ws = widths || [Math.round(width / 2), width]
    return {
      src: pexelsUrl(pick.id, width),
      srcset: ws.map((w) => `${pexelsUrl(pick.id, w)} ${w}w`).join(', '),
      width,
      height: Math.round((width * 2) / 3),
      hotlink: true,
    }
  }
  return optimizeOwn(pick.meta, { width, widths, quality })
}
