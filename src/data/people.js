/* =========================================================
   Vorstand & Ansprechpersonen
   Quelle: Vorstandsseite und Impressum der bisherigen
   Vereinswebsite (Stand 27.10.2026). Drei gleichberechtigte
   Vorsitzende bilden den vertretungsberechtigten Vorstand.
   Persönliche Kontaktdaten werden bewusst nicht veröffentlicht –
   Anfragen laufen über info@sportverein-hochhausen.de.
   ========================================================= */

export const chairs = [
  { name: 'Philipp Seethaler', role: 'Vorsitzender', extra: 'Werbung, Marketing & Sponsoring', initials: 'PS', seed: 1 },
  { name: 'Sebastian Michel', role: 'Vorsitzender', extra: 'Platzwart', initials: 'SM', seed: 2 },
  { name: 'Armin Gärtner', role: 'Vorsitzender', initials: 'AG', seed: 3 },
]

export const officers = [
  { role: 'Schriftführer', names: ['Thomas Göhring'] },
  { role: 'Schatzmeister / Kassenwart', names: ['Franz-Steffen Dörr'] },
  { role: 'Jugendleiter', names: ['Martin Michel'] },
  { role: 'Platzwart', names: ['Sebastian Michel'] },
  { role: 'Werbung, Marketing & Sponsoring', names: ['Philipp Seethaler'] },
  { role: 'Beisitzer', names: ['Alexander Harter', 'Daniel Siehr', 'Martin Michel', 'Maximilian Koll'] },
  { role: 'Kassenprüfer', names: ['Siegfried Siehr', 'Wolfgang Schimpf'] },
]

export const departmentHeads = [
  { dept: 'Fußball', name: 'Daniel Siehr', to: '/fussball/' },
  { dept: 'Bogenschießen', name: 'August Baumann', to: '/sport/bogenschiessen/' },
  { dept: 'Darts', name: 'Alexander Harter', to: '/sport/darts/' },
  { dept: 'Damengymnastik', name: 'Ina Herbach', to: '/sport/damengymnastik/' },
  { dept: 'Nordic Walking', name: 'Jana Nentwig', to: '/sport/nordic-walking/' },
  { dept: 'AH / Wandern', name: 'Alois Dehn', to: '/sport/wandern/' },
]
