/* =========================================================
   Galerie – nur echte Vereinsfotos (+ Instagram, falls der
   Feed eingerichtet ist). Keine Stockfotos.
   ---------------------------------------------------------
   Die Galerie zeigt automatisch ALLE Fotos aus
   src/assets/photos/ (außer den Stockfotos pexels-…).
   Hier stehen nur Titel, Kategorie, Datum und Bildunterschrift.
   Schlüssel = Dateiname ohne Endung.

   Herkunft der aktuellen Fotos: alte Vereinswebsite
   (sportverein-hochhausen.de) und fussball.de – jeweils vom
   Verein selbst veröffentlicht. Stand: 27.10.2026.
   ========================================================= */

export const photoInfo = {
  'football-spg-2024-25-poster': {
    title: 'Spielgemeinschaft 2024/25',
    category: 'Fußball',
    date: '2024-08',
    caption: 'Mannschaftsfoto der SpG Hochhausen/Tauberbischofsheim, Saison 2024/25',
    source: 'fussball.de',
  },
  'football-spg-2020-21-poster': {
    title: 'Spielgemeinschaft 2020/21',
    category: 'Fußball',
    date: '2020-09-13',
    caption: 'SpG SV Hochhausen / TSG Impfingen 2 / TSV Tauberbischofsheim 3, Kreisklasse C – aufgenommen am 13. September 2020',
    source: 'alte Vereinswebsite',
  },
  archery: {
    title: 'Unser Robin Hood',
    category: 'Bogenschießen',
    date: '2016-10-15',
    caption: 'Unser Robin Hood – Reinhold (Treffer vom 15.10.2016)',
    source: 'alte Vereinswebsite',
  },
  football: {
    title: '1. Mannschaft 2015',
    category: 'Fußball',
    date: '2015-11',
    caption: 'Mannschaftsfoto der 1. Mannschaft, November 2015',
    source: 'alte Vereinswebsite',
  },
  gym: {
    title: 'Damengymnastik',
    category: 'Gymnastik',
    date: '2015-05',
    caption: 'Ein Teil unserer Damengymnastik-Gruppe',
    source: 'alte Vereinswebsite',
  },
  'gym-2': { title: 'Damengymnastik', category: 'Gymnastik', date: '2013-03', caption: 'Damengymnastik', source: 'alte Vereinswebsite' },
  'gym-3': { title: 'Damengymnastik', category: 'Gymnastik', date: '2013-03', caption: 'Damengymnastik', source: 'alte Vereinswebsite' },
  hiking: {
    title: 'Wanderung 2013',
    category: 'Wandern',
    date: '2013-07-07',
    caption: 'Unterwegs bei der Wanderung am 7. Juli 2013',
    source: 'alte Vereinswebsite',
  },
  nordic: {
    title: 'Nordic Walking',
    category: 'Nordic Walking',
    date: '2012-12',
    caption: 'Einige Teilnehmer der Nordic-Walking-Abteilung',
    source: 'alte Vereinswebsite',
  },
}

/* Kategorie aus dem Dateinamen-Thema, falls oben nichts steht */
export const themeCategory = {
  football: 'Fußball',
  archery: 'Bogenschießen',
  darts: 'Darts',
  gym: 'Gymnastik',
  nordic: 'Nordic Walking',
  hiking: 'Wandern',
  youth: 'Jugend',
  history: 'Geschichte',
}

/* Reihenfolge der Filter-Chips (nur vorhandene werden angezeigt) */
export const categoryOrder = ['Instagram', 'Fußball', 'Bogenschießen', 'Darts', 'Gymnastik', 'Nordic Walking', 'Wandern', 'Jugend', 'Vereinsleben', 'Geschichte']
