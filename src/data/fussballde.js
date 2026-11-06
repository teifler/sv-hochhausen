/* =========================================================
   fussball.de – Fußball beim SV Hochhausen (Tauber)
   ---------------------------------------------------------
   Quelle: Vereinsseite „SV Hochhausen" (Baden) auf fussball.de
   (Zum Sportplatz 10, 97941 Tauberbischofsheim · gegr. 1946 ·
   blau/schwarz/rot), Saison 2026/27, Stand 27.10.2026.
   Spielgemeinschaft mit dem TSV 1863 Tauberbischofsheim
   (laut tsv-1863.de seit der Saison 2000/01).

   Live-Daten (Spielplan, Ergebnisse, Tabelle) kommen über die
   offiziellen fussball.de-Widgets. Den Widget-Code erzeugt ein
   Vereinsverantwortlicher nach Login auf fussball.de unter
   „Widgets" und fügt ihn unten bei `embedHtml` ein
   (Schritt-für-Schritt: ANPASSEN.md).
   ========================================================= */

export const fussballde = {
  club: 'SV Hochhausen',
  clubUrl: 'https://www.fussball.de/verein/sv-hochhausen-baden/-/id/00ES8GN9A000009DVV0AG08LVUPGND5I',
  clubId: '00ES8GN9A000009DVV0AG08LVUPGND5I',
  district: 'Fußballkreis Tauberbischofsheim',
  association: 'Badischer Fußballverband (bfv)',
  season: '2026/27',
  venue: 'Sportplatz Hochhausen, Zum Sportplatz 10, 97941 Tauberbischofsheim-Hochhausen',
  partner: {
    name: 'TSV 1863 Tauberbischofsheim',
    url: 'https://www.tsv-1863.de',
    since: '2000/01',
  },

  teams: [
    {
      id: 'herren',
      label: 'Herren',
      name: "SpG Hochhausen/Tauberb.'heim 3",
      nameLong: 'SpG Hochhausen/Tauberbischofsheim 3',
      league: 'bfv-Kreisklasse B Tauberbischofsheim · Staffel 2',
      url: "https://www.fussball.de/mannschaft/spg-hochhausen-tauberb'heim-3-sv-hochhausen-baden/-/saison/2627/team-id/02B9AM5MRO000000VS5489B1VU7OHECJ",
      teamId: '02B9AM5MRO000000VS5489B1VU7OHECJ',
    },
  ],

  /* Zwischenstand laut fussball.de (nur Anzeige, keine Live-Daten) */
  standing: {
    asOf: '2026-10-27',
    rank: 5,
    points: 10,
    games: 8,
    won: 3,
    drawn: 1,
    lost: 4,
    goals: '20:24',
  },

  /* Widgets aus fussball.de (Login → „Widgets" → Code kopieren).
     embedHtml: der komplette kopierte Code (div + script) als String.
     widgetId:  alternativ nur die ID für den klassischen Loader.
     Ohne Code zeigt die Seite automatisch Links zu fussball.de. */
  widgets: [
    { id: 'spielplan', team: 'herren', title: 'Spielplan & Ergebnisse', embedHtml: null, widgetId: null },
    { id: 'tabelle', team: 'herren', title: 'Tabelle · Kreisklasse B, Staffel 2', embedHtml: null, widgetId: null },
  ],

  /* Optional: nächste Spiele von Hand eintragen (Stand laut fussball.de).
     Vergangene Spiele blendet die Seite beim täglichen Neubau
     automatisch aus. Ansetzungen können sich kurzfristig ändern. */
  fixtures: [
    {
      team: 'herren',
      date: '2027-04-11',
      time: '13:00',
      home: "SpG Hochhausen/Tauberb.'heim 3",
      away: 'SpG Vikt. Wertheim 3/Grünenwört',
      isHome: true,
      competition: 'Kreisklasse B Tauberbischofsheim · St. 2',
      provisional: true,
    },
  ],
}

export function getTeam(id) {
  return fussballde.teams.find((t) => t.id === id) || null
}
