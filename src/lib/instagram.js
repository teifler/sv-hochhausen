/* =========================================================
   Instagram-Feed (beim Build geladen, lokal gespeichert)
   scripts/prebuild.mjs legt die Bilder + feed.json unter
   src/assets/instagram/ ab. Ohne Zugangsdaten bleibt die Liste
   leer und die Seite zeigt eine „Folge uns"-Kachel.
   Die Beiträge erscheinen im Social-Bereich UND in der Galerie.
   ========================================================= */
import { getImage } from 'astro:assets'

const feedFiles = import.meta.glob('/src/assets/instagram/feed.json', { eager: true, import: 'default' })
const imageFiles = import.meta.glob('/src/assets/instagram/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })

const feed = Object.values(feedFiles)[0] || { posts: [] }

/** Rohdaten: Beiträge mit Bild-Asset (meta), neueste zuerst */
export function instagramRaw(limit = 48) {
  return (feed.posts || [])
    .map((post) => ({ ...post, meta: imageFiles[`/src/assets/instagram/${post.file}`] }))
    .filter((p) => p.meta)
    .slice(0, limit)
}

export async function instagramPosts(limit = 6) {
  const out = []
  for (const post of instagramRaw(limit)) {
    const { meta } = post
    const img = await getImage({ src: meta, width: 480, widths: [240, 480], format: 'webp', quality: 70 })
    out.push({
      ...post,
      src: img.src,
      srcset: img.srcSet?.attribute || '',
      width: 480,
      height: Math.round((meta.height / meta.width) * 480),
    })
  }
  return out
}

export const instagramUpdatedAt = feed.updatedAt || null
