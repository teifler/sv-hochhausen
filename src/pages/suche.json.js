/* Suchindex als statische JSON-Datei (/suche.json) */
import { buildSearchIndex } from '../lib/search.js'

export function GET() {
  return new Response(JSON.stringify(buildSearchIndex()), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}
