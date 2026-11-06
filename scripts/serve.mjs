#!/usr/bin/env node
/* =========================================================
   Mini-Static-Server für den fertigen Build (E2E-Tests, lokale Vorschau)
   ---------------------------------------------------------
   Verhält sich wie ein normaler Webspace: /pfad → 301 auf /pfad/,
   /pfad/ → pfad/index.html, unbekannte Adressen → 404.html mit Status 404.
   Ohne Abhängigkeiten.

   node scripts/serve.mjs [--port 4173] [--dir dist]
   (Ordner auch per SVH_STATIC_DIR)
   ========================================================= */
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'

const args = process.argv.slice(2)
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}
const port = Number(arg('port', process.env.PORT || 4173))
const root = path.resolve(arg('dir', process.env.SVH_STATIC_DIR || 'dist'))

if (!existsSync(path.join(root, 'index.html'))) {
  console.error(`[serve] Kein Build in ${root} – zuerst \`npm run build:local\` ausführen.`)
  process.exit(1)
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.webmanifest': 'application/manifest+json',
}

function send(req, res, status, file) {
  res.writeHead(status, {
    'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'cache-control': 'no-store',
  })
  if (req.method === 'HEAD') return res.end()
  createReadStream(file).pipe(res)
}

const isFile = (p) => existsSync(p) && statSync(p).isFile()
const isDir = (p) => existsSync(p) && statSync(p).isDirectory()

createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { allow: 'GET, HEAD' })
    return res.end()
  }
  const url = new URL(req.url, 'http://localhost')
  let pathname
  try {
    pathname = decodeURIComponent(url.pathname)
  } catch {
    res.writeHead(400)
    return res.end()
  }
  const target = path.join(root, path.normalize(pathname))
  if (target !== root && !target.startsWith(root + path.sep)) {
    res.writeHead(403)
    return res.end()
  }
  if (isDir(target)) {
    if (!url.pathname.endsWith('/')) {
      res.writeHead(301, { location: `${url.pathname}/${url.search}` })
      return res.end()
    }
    if (isFile(path.join(target, 'index.html'))) return send(req, res, 200, path.join(target, 'index.html'))
  } else if (isFile(target)) {
    return send(req, res, 200, target)
  }
  return send(req, res, 404, path.join(root, '404.html'))
}).listen(port, () => console.log(`[serve] ${root} → http://localhost:${port}/`))
