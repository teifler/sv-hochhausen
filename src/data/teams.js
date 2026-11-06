/* =========================================================
   Mannschaft & Spiele
   Daten laut fussball.de (Saison 2026/27). Spiele kommen aus
   fussballde.js (fixtures) – ohne Eintrag zeigt die Seite einen
   Link zum Spielplan auf fussball.de.
   ========================================================= */
import { fussballde, getTeam } from './fussballde.js'
import { todayKey } from '../lib/format.js'

/* Spiele ab heute, chronologisch (Datum + Uhrzeit) */
export function upcomingFixtures(key = todayKey()) {
  return fussballde.fixtures
    .filter((f) => f.date >= key)
    .sort((a, b) => `${a.date} ${a.time || ''}`.localeCompare(`${b.date} ${b.time || ''}`))
    .map((f) => ({ ...f, teamData: getTeam(f.team) }))
}

/* Nächstes Spiel (oder null) */
export function nextMatch(key = todayKey()) {
  return upcomingFixtures(key)[0] || null
}
