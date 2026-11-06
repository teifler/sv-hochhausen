/* =========================================================
   Sponsoren & Partner
   ---------------------------------------------------------
   SPONSOREN: neuen Eintrag in `sponsors` ergänzen (Reihenfolge
   = Reihenfolge auf der Website).
   Logo: Datei mit dem Namen der `id` ablegen –
     src/assets/sponsors/<id>.png | .jpg | .webp   (wird optimiert)
     oder public/sponsors/<id>.svg und `logo: '/sponsors/<id>.svg'`
   Ohne Logo-Datei erscheint der Name als schlichte Schriftkachel.
   Bitte nur Logos verwenden, die der Sponsor freigegeben hat
   (am besten direkt beim Sponsor anfragen).
   ========================================================= */

export const sponsors = [
  {
    id: 'e-center-duerr',
    name: 'E center Dürr',
    category: 'Lebensmittelmarkt',
    place: 'Pestalozziallee 33, 97941 Tauberbischofsheim',
    url: 'https://www.edeka.de/maerkte/024331/',
  },
]

/* Partner & Links (Spielbetrieb, Verband, Stadt) */
export const partners = [
  {
    name: 'TSV 1863 Tauberbischofsheim',
    short: 'TSV 1863',
    category: 'SpG-Partner Fußball',
    url: 'https://www.tsv-1863.de',
  },
  {
    name: 'SV Hochhausen auf fussball.de',
    short: 'fussball.de',
    category: 'Spielbetrieb',
    url: 'https://www.fussball.de/verein/sv-hochhausen-baden/-/id/00ES8GN9A000009DVV0AG08LVUPGND5I',
  },
  {
    name: 'Badischer Fußballverband',
    short: 'bfv',
    category: 'Verband',
    url: 'https://www.badfv.de',
  },
  {
    name: 'Stadt Tauberbischofsheim',
    short: 'TBB',
    category: 'Stadt',
    url: 'https://www.tauberbischofsheim.de',
  },
]
