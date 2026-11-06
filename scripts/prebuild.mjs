#!/usr/bin/env node
/* =========================================================
   Prebuild: Bilder vor dem Astro-Build lokal bereitstellen
   ---------------------------------------------------------
   1) Stockfotos (Pexels) nach src/assets/photos/ laden
   2) Instagram-Feed (Behold-JSON oder Instagram-Token) laden
      und Bilder nach src/assets/instagram/ speichern

   Das Skript bricht den Build NIE ab: Fehlt das Netz oder ein
   Dienst, nutzt die Seite automatisch SVG-Platzhalter bzw. die
   „Folge uns"-Kachel.

   Optionen:
     --no-photos        keine Stockfotos laden (oder SVH_PHOTOS=off)
     --no-instagram     Instagram überspringen
   Umgebungsvariablen: siehe .env.example
   ========================================================= */
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { allPexelsIds, pexelsUrl } from '../src/lib/pexels.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PHOTO_DIR = path.join(root, 'src/assets/photos')
const INSTA_DIR = path.join(root, 'src/assets/instagram')
const args = new Set(process.argv.slice(2))

/* .env (lokal) einlesen, ohne zusätzliche Abhängigkeit */
async function loadDotEnv() {
  for (const name of ['.env', '.env.local']) {
    const file = path.join(root, name)
    if (!existsSync(file)) continue
    const txt = await readFile(file, 'utf8')
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (!m || process.env[m[1]] !== undefined) continue
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
}

const log = (...a) => console.log('[prebuild]', ...a)

async function download(url, file, { timeout = 25000 } = {}) {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeout), headers: { 'User-Agent': 'svh-website-build' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const type = res.headers.get('content-type') || ''
  if (!type.startsWith('image/')) throw new Error(`kein Bild (${type})`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 2000) throw new Error('Datei zu klein')
  await writeFile(file, buf)
  return buf.length
}

async function pool(items, limit, fn) {
  const queue = [...items]
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) await fn(queue.shift())
  })
  await Promise.all(workers)
}

/* ---------- 1) Stockfotos ---------------------------------- */
async function photos() {
  const off = args.has('--no-photos') || /^(off|0|false|no)$/i.test(process.env.SVH_PHOTOS || '')
  if (off) {
    log('Stockfotos: übersprungen (SVG-Platzhalter werden genutzt)')
    return
  }
  await mkdir(PHOTO_DIR, { recursive: true })
  const ids = allPexelsIds()
  let ok = 0
  let cached = 0
  let failed = 0
  await pool(ids, 4, async (id) => {
    const file = path.join(PHOTO_DIR, `pexels-${id}.jpg`)
    if (existsSync(file) && (await stat(file)).size > 2000) {
      cached++
      return
    }
    try {
      await download(pexelsUrl(id), file)
      ok++
    } catch (e) {
      failed++
      log(`  Foto ${id} nicht geladen: ${e.message}`)
    }
  })
  log(`Stockfotos: ${ok} neu, ${cached} vorhanden, ${failed} fehlgeschlagen`)
}

/* ---------- 2) Instagram ----------------------------------- */
function normalizeBehold(data) {
  const list = Array.isArray(data) ? data : data?.posts || []
  return list.map((p) => ({
    id: String(p.id),
    caption: p.prunedCaption || p.caption || '',
    permalink: p.permalink,
    timestamp: p.timestamp,
    type: p.mediaType || p.media_type || 'IMAGE',
    image:
      p.sizes?.medium?.mediaUrl ||
      p.sizes?.large?.mediaUrl ||
      (String(p.mediaType).toUpperCase() === 'VIDEO' ? p.thumbnailUrl : p.mediaUrl) ||
      p.thumbnailUrl,
  }))
}

function normalizeGraph(data) {
  return (data?.data || []).map((p) => ({
    id: String(p.id),
    caption: p.caption || '',
    permalink: p.permalink,
    timestamp: p.timestamp,
    type: p.media_type || 'IMAGE',
    image: p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url,
  }))
}

async function instagram() {
  if (args.has('--no-instagram')) return log('Instagram: übersprungen')
  const feedUrl = process.env.INSTAGRAM_FEED_URL
  const token = process.env.INSTAGRAM_TOKEN
  const limit = Math.max(1, Math.min(24, Number(process.env.INSTAGRAM_LIMIT || 12)))
  if (!feedUrl && !token) {
    log('Instagram: kein INSTAGRAM_FEED_URL / INSTAGRAM_TOKEN gesetzt – „Folge uns"-Kachel wird angezeigt')
    return
  }
  try {
    let posts
    if (feedUrl) {
      const res = await fetch(feedUrl, { signal: AbortSignal.timeout(20000) })
      if (!res.ok) throw new Error(`Feed HTTP ${res.status}`)
      posts = normalizeBehold(await res.json())
    } else {
      const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp'
      const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(token)}`
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) })
      if (!res.ok) throw new Error(`Graph API HTTP ${res.status}`)
      posts = normalizeGraph(await res.json())
    }
    posts = posts.filter((p) => p.image && p.permalink).slice(0, limit)
    await mkdir(INSTA_DIR, { recursive: true })
    const kept = []
    await pool(posts, 4, async (p) => {
      const safeId = p.id.replace(/[^a-zA-Z0-9_-]/g, '')
      const file = `ig-${safeId}.jpg`
      const target = path.join(INSTA_DIR, file)
      try {
        if (!existsSync(target)) await download(p.image, target)
        kept.push({ id: safeId, file, caption: p.caption.slice(0, 300), permalink: p.permalink, timestamp: p.timestamp, type: p.type })
      } catch (e) {
        log(`  Instagram-Bild ${p.id} nicht geladen: ${e.message}`)
      }
    })
    kept.sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)))
    /* alte Bilder aufräumen */
    const keep = new Set(kept.map((k) => k.file))
    for (const f of await readdir(INSTA_DIR)) {
      if (f.startsWith('ig-') && !keep.has(f)) await rm(path.join(INSTA_DIR, f), { force: true })
    }
    await writeFile(path.join(INSTA_DIR, 'feed.json'), JSON.stringify({ updatedAt: new Date().toISOString(), posts: kept }, null, 2))
    log(`Instagram: ${kept.length} Beiträge gespeichert`)
  } catch (e) {
    log(`Instagram: nicht geladen (${e.message}) – „Folge uns"-Kachel wird angezeigt`)
  }
}

try {
  await loadDotEnv()
  await photos()
  await instagram()
} catch (e) {
  log('Unerwarteter Fehler (Build läuft trotzdem weiter):', e?.message || e)
}
