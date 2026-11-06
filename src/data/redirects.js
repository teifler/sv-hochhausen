/* =========================================================
   Weiterleitungen: Adressen der bisherigen Vereinswebsite
   (sportverein-hochhausen.de) und umbenannte Seiten.
   ---------------------------------------------------------
   Pfad ohne Schrägstrich am Anfang → neues Ziel.
   Es entstehen kleine Seiten mit Sofort-Weiterleitung (funktioniert
   mit und ohne Schrägstrich am Ende, auch für Google). Gleiche
   Adressen (/aktuelles/, /termine/, /kontakt/, /sponsoren/,
   /impressum/) brauchen keinen Eintrag.
   ========================================================= */
export const legacyRedirects = {
  partner: '/sponsoren/',
  'der-verein': '/verein/',
  'der-verein/vorstand': '/verein/#vorstand',
  'der-verein/satzung': '/mitglied-werden/#downloads',
  'der-verein/aufnahmeantrag': '/mitglied-werden/',
  'der-verein/chronik': '/verein/#geschichte',
  sportarten: '/sport/',
  'sportarten/fußball': '/fussball/',
  'sportarten/bogenschießen': '/sport/bogenschiessen/',
  'sportarten/bogenschießen/links': '/sport/bogenschiessen/',
  'sportarten/bogenschießen/bildergalerie': '/galerie/',
  'sportarten/darts': '/sport/darts/',
  'sportarten/damengymnastik': '/sport/damengymnastik/',
  'sportarten/nordic-walking': '/sport/nordic-walking/',
  'sportarten/wandern': '/sport/wandern/',
  'kontakt/anfahrt': '/kontakt/',
}
