/* =========================================================
   Veranstaltungen & Termine
   ---------------------------------------------------------
   Nur echte Termine eintragen. Die Maiwanderung am 1. Mai ist
   ein fester jährlicher Termin (annual: true). Fußballspiele
   kommen automatisch aus fussballde.js (fixtures).
   Weitere Termine (Feste, Mitgliederversammlung, Turniere)
   einfach unten ergänzen – Format siehe ANPASSEN.md.

   Hinweis: Die Seite ist statisch. „Kommende Termine" werden
   beim Build berechnet – der tägliche Neubau (siehe README)
   hält die Liste aktuell.
   ========================================================= */
import { todayKey } from '../lib/format.js'
import { fussballde, getTeam } from './fussballde.js'

/* Termin-Typ -> Label, Farbe (Filter/Kalender), Icon */
export const eventTypes = {
  fussball: { label: 'Fußball', color: 'var(--svh-acc-fussball)', icon: 'ball' },
  bogen: { label: 'Bogenschießen', color: 'var(--svh-acc-bogen)', icon: 'bow' },
  darts: { label: 'Darts', color: 'var(--svh-acc-darts)', icon: 'target' },
  wandern: { label: 'Wandern', color: 'var(--svh-acc-wandern)', icon: 'mountain' },
  verein: { label: 'Verein', color: 'var(--svh-acc-verein)', icon: 'users' },
  fest: { label: 'Fest', color: 'var(--svh-acc-fest)', icon: 'sparkles' },
  training: { label: 'Training', color: 'var(--svh-acc-training)', icon: 'clock' },
}

const clubEvents = [
  {
    id: 'maiwanderung-2027',
    title: 'Maiwanderung',
    date: '2027-05-01',
    time: '10:00',
    location: 'Start: Friedhofsparkplatz bzw. Grünauer Hof · Ziel: Sportheim',
    locationId: 'friedhof',
    type: 'wandern',
    annual: true,
    description:
      'Die traditionelle Wanderung am 1. Mai: rund drei Stunden unterwegs rund um Hochhausen, anschließend Ausklang im Sportheim mit kühlen Getränken und Gegrilltem – für Wanderer und Gäste.',
  },
]

/* Fußballspiele aus fussball.de-Daten */
const matchEvents = fussballde.fixtures.map((f) => {
  const team = getTeam(f.team)
  return {
    id: `spiel-${f.team}-${f.date}`,
    title: f.isHome ? `Heimspiel gegen ${f.away}` : `Auswärtsspiel bei ${f.home}`,
    date: f.date,
    time: f.time,
    location: f.isHome ? 'Sportplatz Hochhausen' : 'Auswärts',
    locationId: f.isHome ? 'sportplatz' : null,
    type: 'fussball',
    provisional: !!f.provisional,
    url: team?.url || fussballde.clubUrl,
    description: `${f.home} – ${f.away} · ${f.competition}.`,
  }
})

export const events = [...clubEvents, ...matchEvents]

export const eventsSorted = [...events].sort((a, b) =>
  `${a.date} ${a.time || ''}`.localeCompare(`${b.date} ${b.time || ''}`),
)

/* Kommende Termine ab heute (deutsche Zeit, Build-Zeitpunkt). */
export function upcomingEvents(key = todayKey()) {
  return eventsSorted.filter((e) => e.date >= key)
}
