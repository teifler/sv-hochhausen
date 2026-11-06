/* =========================================================
   Dokumente & Downloads
   PDFs liegen in public/downloads/ (von der bisherigen Website
   übernommen) und werden unter /downloads/<datei>.pdf ausgeliefert.
   Neue Datei: dort ablegen und hier eintragen.
   ========================================================= */

export const documents = [
  {
    id: 'mitgliedsantrag',
    title: 'Mitgliedsantrag / Beitrittserklärung',
    category: 'Mitgliedschaft',
    desc: 'Ausfüllen, unterschreiben und per E-Mail, Post oder über die Abteilungsleitung abgeben – inkl. Infos zum Mitgliedsbeitrag.',
    fileType: 'PDF',
    url: '/downloads/mitgliedsantrag-beitrittserklaerung.pdf',
  },
  {
    id: 'satzung',
    title: 'Vereinssatzung',
    category: 'Verein',
    desc: 'Satzung des Sportverein 1946 Hochhausen e.V. (Fassung vom 15.03.2014).',
    fileType: 'PDF',
    url: '/downloads/satzung-2014-03-15.pdf',
  },
  {
    id: 'chronik',
    title: 'Vereinschronik 1946–2006',
    category: 'Verein',
    desc: 'Die ausführliche Chronik des SV Hochhausen mit Bildern (Word-Dokument, ca. 30 MB).',
    fileType: 'DOC',
    url: 'https://www.sportverein-hochhausen.de/der-verein/chronik/',
  },
]

export const requestEmail = 'info@sportverein-hochhausen.de'
