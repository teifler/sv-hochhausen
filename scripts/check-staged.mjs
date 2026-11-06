#!/usr/bin/env node
/* =========================================================
   Wächter für Commits (Husky pre-commit / commit-msg) – das Repository ist öffentlich.
   Blockiert:
   - .env-Dateien (außer .env.example) und private Schlüssel
   - Zeilen wie `passwort = …`, `token: …` mit echtem Wert
   - jeden Wert aus der lokalen .env (Server, Loginname, Pfad, Tokens …) – in Dateien und in der
     Commit-Nachricht. Die Werte stehen nur lokal in .env und werden nie ausgegeben.
   - Dateien über 50 MB
   Aufruf: node scripts/check-staged.mjs            (gestagte Dateien)
           node scripts/check-staged.mjs --message <datei>   (Commit-Nachricht)
   ========================================================= */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

export const MAX_BYTES = 50 * 1024 * 1024
const PRIVATE_KEY = /-----BEGIN [A-Z ]*PRIVATE KEY-----/
const CREDENTIAL = /\b(passwor[dt]|passwd|secret|token|api[_-]?key)\b\s*[:=]\s*['"]?([^\s'"<>`]{6,})/i
/* Variablen aus .env, deren Werte öffentlich sind bzw. zu kurz/allgemein für einen sinnvollen Vergleich */
const PUBLIC_KEYS = new Set(['SITE_URL', 'INSTAGRAM_LIMIT', 'SVH_PHOTOS', 'SVH_HOTLINK'])

/* Werte aus der lokalen .env, die nie im Repo auftauchen dürfen: [[NAME, Wert], …] */
export function secretValues(envText = '') {
  const out = []
  for (const line of envText.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (!m || PUBLIC_KEYS.has(m[1])) continue
    const value = m[2].replace(/^["']|["']$/g, '')
    if (value.length >= 4 && !/^\d+$/.test(value)) out.push([m[1], value])
  }
  return out
}

/* files: [{ path, size, content (string|null bei Binärdateien) }] → Liste von Problemen (ohne Werte) */
export function findProblems(files, secrets = []) {
  const problems = []
  for (const f of files) {
    const name = f.path.split('/').pop()
    if (/^\.env(\..+)?$/.test(name) && name !== '.env.example')
      problems.push(`${f.path}: .env-Dateien gehören nicht ins Repo`)
    if (f.size > MAX_BYTES) problems.push(`${f.path}: größer als 50 MB`)
    if (f.content == null) continue
    if (PRIVATE_KEY.test(f.content)) problems.push(`${f.path}: enthält einen privaten Schlüssel`)
    const cred = f.content.match(CREDENTIAL)
    /* Code wie `token = process.env.X` oder `secret = form.get('x')` ist kein Zugangswert */
    if (cred && !/^[A-Za-z_$][\w$]*(\.|\()/.test(cred[2]))
      problems.push(`${f.path}: sieht nach einem Zugangswert aus („${cred[1]} = …“)`)
    for (const [key, value] of secrets) {
      if (f.content.includes(value)) problems.push(`${f.path}: enthält den Wert von ${key} aus der lokalen .env`)
    }
  }
  return problems
}

function git(args) {
  return execFileSync('git', args, { encoding: 'buffer', maxBuffer: 256 * 1024 * 1024 })
}

function stagedFiles() {
  const list = git(['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'])
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
  return list.map((path) => {
    const blob = git(['show', `:${path}`])
    const binary = blob.subarray(0, 8000).includes(0)
    return { path, size: blob.length, content: binary ? null : blob.toString('utf8') }
  })
}

function main() {
  const secrets = existsSync('.env') ? secretValues(readFileSync('.env', 'utf8')) : []
  const i = process.argv.indexOf('--message')
  const files =
    i > 0 ? [{ path: 'Commit-Nachricht', size: 0, content: readFileSync(process.argv[i + 1], 'utf8') }] : stagedFiles()
  const problems = findProblems(files, secrets)
  if (!problems.length) return
  console.error('\n✗ Commit gestoppt – das Repository ist öffentlich (AGENTS.md, Regel 1):')
  for (const p of problems) console.error(`  - ${p}`)
  console.error('\nZugangsdaten gehören nur in die lokale .env bzw. in GitHub-Secrets.\n')
  process.exit(1)
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) main()
