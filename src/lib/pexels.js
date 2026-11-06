/* =========================================================
   Stockfotos – bewusst nur WENIGE (Pexels-Lizenz: frei
   nutzbar, ohne Namensnennung)
   ---------------------------------------------------------
   Reihenfolge der Bildquellen: echte Vereinsfotos
   (src/assets/photos/) > diese Stockfotos > gezeichnete
   Grafik in Vereinsfarben. Jedes Foto erscheint höchstens
   einmal pro Seite.

   Alle Motive wurden einzeln angesehen: keine erkennbaren
   Personen, keine Logos, keine Trikots anderer Vereine.
   Werden beim Build (scripts/prebuild.mjs) heruntergeladen
   und von der eigenen Website ausgeliefert.
   ========================================================= */

export const PEXELS = {
  /* Hügel mit Rapsfeldern, Deutschland (Querformat) */
  hero: ['30391447'],
  landscape: ['30391447'],
  /* Feldweg durch hohes Gras, blauer Himmel */
  hiking: ['31290935', '30391447'],
  /* Waldweg im Herbst, zwei Spaziergänger von hinten (winzig, nicht erkennbar) */
  nordic: ['5483841'],
  /* Pfeile im Dartboard (Nahaufnahme); Dartscheibe an weißer Wand */
  darts: ['8763241', '10792812'],
  /* Bogen-Zielscheiben auf der Wiese; zwei Zielscheiben nah */
  archery: ['6540677', '6540680'],
}

/* Themen ohne eigene Liste nutzen ein verwandtes Thema */
export const THEME_ALIASES = {
  gallery: 'club',
  neutral: 'club',
  event: 'fest',
  gymnastics: 'gym',
  fitness: 'gym',
  team: 'football',
  natur: 'landscape',
}

export function pexelsUrl(id, width = 1600) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`
}

export function allPexelsIds() {
  return [...new Set(Object.values(PEXELS).flat())]
}
