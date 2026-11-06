/* =========================================================
   Zentrale Vereins- und Seitendaten
   ---------------------------------------------------------
   Stammdaten, Kontakt, Social Media, Navigation und Footer.
   Bewusst einfache Objekte/Arrays, damit die Inhalte später
   problemlos aus einem CMS oder einer API kommen können.

   Quellen: bisherige Vereinswebsite sportverein-hochhausen.de
   (Impressum, Verein, Vorstand, Sportarten) und die Vereins-
   seite auf fussball.de. Stand: 27.10.2026.

   ACHTUNG Verwechslungsgefahr: Der „SV Hochhausen 1966 e.V.“
   (Hochhausen am Neckar, Haßmersheim, sv-hochhausen.de) ist
   ein ANDERER Verein. Diese Website gehört zum Sportverein
   1946 Hochhausen/Tauber e.V. in Tauberbischofsheim-Hochhausen.
   ========================================================= */

export const club = {
  name: 'SV Hochhausen 1946 e.V.',
  shortName: 'SV Hochhausen',
  legalName: 'Sportverein 1946 Hochhausen/Tauber e.V.',
  claim: 'Mehr als Fußball.',
  tagline: 'Fußball, Bogenschießen, Darts, Damengymnastik, Nordic Walking und Wandern – seit 1946.',
  founded: 1946,
  members: 'ca. 280',
  colors: 'Blau / Schwarz / Rot',
  place: 'Hochhausen',
  placeLong: 'Hochhausen/Tauber',
  municipality: 'Tauberbischofsheim', // Hochhausen ist Stadtteil von Tauberbischofsheim
  region: 'Tauberbischofsheim · Main-Tauber-Kreis',
  register: {
    court: 'Amtsgericht Mannheim',
    number: 'VR 560044',
  },
  website: 'https://www.sportverein-hochhausen.de',
}

/* Kontakt & Standorte */
export const contact = {
  main: {
    label: 'Vorstandsteam',
    street: 'Zum Sportplatz 10',
    zip: '97941',
    city: 'Tauberbischofsheim-Hochhausen',
    phone: '09341 12534',
    phoneLabel: 'Sportheim',
    phoneHref: '+49934112534',
    email: 'info@sportverein-hochhausen.de',
  },
  locations: [
    {
      id: 'sportplatz',
      name: 'Sportplatz & Sportheim',
      icon: 'ball',
      street: 'Zum Sportplatz 10',
      zip: '97941',
      city: 'Tauberbischofsheim-Hochhausen',
      phone: '09341 12534',
      phoneHref: '+49934112534',
      note: 'Fußball, Bogenschießen · Sportheim als Treffpunkt',
      maps: 'Zum Sportplatz 10, 97941 Tauberbischofsheim',
    },
    {
      id: 'konradsaal',
      name: 'Konradsaal Hochhausen',
      icon: 'activity',
      street: 'Pfarrgasse 1',
      zip: '97941',
      city: 'Tauberbischofsheim-Hochhausen',
      note: 'Damengymnastik dienstags und donnerstags',
      maps: 'Konradsaal, Pfarrgasse 1, 97941 Tauberbischofsheim',
    },
  ],
}

/* Karten-/Routenlink (öffnet die Karten-App des Geräts) */
export function routeUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

/* Social Media – Instagram wird hauptsächlich genutzt.
   Kanäle ohne url werden automatisch ausgeblendet. */
export const socials = [
  { id: 'instagram', label: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/sv_hochhausen/' },
  { id: 'facebook', label: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/Sv1946Hochhausen/' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', url: null },
]

export const instagram = {
  handle: 'sv_hochhausen',
  url: 'https://www.instagram.com/sv_hochhausen/',
}

/* Haupt-Navigation (Desktop + Mobile). children -> Dropdown. */
export const nav = [
  { label: 'Aktuelles', to: '/aktuelles/' },
  {
    label: 'Verein',
    to: '/verein/',
    children: [
      { label: 'Über den Verein', to: '/verein/', desc: 'Seit 1946 in Hochhausen' },
      { label: 'Vorstand', to: '/verein/#vorstand', desc: 'Drei Vorsitzende & Team' },
      { label: 'Geschichte', to: '/verein/#geschichte', desc: 'Meilensteine seit 1946' },
      { label: 'Sportstätten', to: '/verein/#sportstaetten', desc: 'Sportplatz, Sportheim & Konradsaal' },
      { label: 'Satzung & Downloads', to: '/mitglied-werden/#downloads', desc: 'Satzung, Aufnahmeantrag' },
      { label: 'Spenden', to: '/spenden/', desc: 'Den Verein direkt unterstützen' },
      { label: 'Sponsoren', to: '/sponsoren/', desc: 'Danke an unsere Unterstützer' },
    ],
  },
  {
    label: 'Sport',
    to: '/sport/',
    children: [
      { label: 'Alle Sportangebote', to: '/sport/', desc: 'Sechs Abteilungen im Überblick' },
      { label: 'Fußball', to: '/fussball/', desc: 'SpG, Spielplan & Tabelle' },
      { label: 'Bogenschießen', to: '/sport/bogenschiessen/', desc: 'Parcours, Turniere & Schnuppern' },
      { label: 'Darts', to: '/sport/darts/', desc: 'Jeden Donnerstag ab 19:30 Uhr' },
      { label: 'Damengymnastik', to: '/sport/damengymnastik/', desc: 'Di & Do im Konradsaal' },
      { label: 'Nordic Walking', to: '/sport/nordic-walking/', desc: 'Montags & donnerstags' },
      { label: 'Wandern', to: '/sport/wandern/', desc: 'Touren & Maiwanderung' },
    ],
  },
  { label: 'Jugend', to: '/jugend/' },
  {
    label: 'Termine',
    to: '/termine/',
    children: [
      { label: 'Termine & Training', to: '/termine/', desc: 'Veranstaltungen & Wochenplan' },
      { label: 'Vereinskalender', to: '/kalender/', desc: 'Liste & Monatsansicht' },
    ],
  },
  { label: 'Vereinsleben', to: '/vereinsleben/' },
  { label: 'Galerie', to: '/galerie/' },
  { label: 'Kontakt', to: '/kontakt/' },
]

/* Zusätzliche Punkte im Mobile-Menü */
export const mobileExtra = [
  { label: 'Mitglied werden', to: '/mitglied-werden/' },
  { label: 'Spenden', to: '/spenden/' },
  { label: 'Sponsoren', to: '/sponsoren/' },
]

/* Footer-Spalten */
export const footerNav = [
  {
    title: 'Verein',
    links: [
      { label: 'Über den Verein', to: '/verein/' },
      { label: 'Vorstand', to: '/verein/#vorstand' },
      { label: 'Geschichte', to: '/verein/#geschichte' },
      { label: 'Sportstätten', to: '/verein/#sportstaetten' },
      { label: 'Satzung & Downloads', to: '/mitglied-werden/#downloads' },
    ],
  },
  {
    title: 'Sport',
    links: [
      { label: 'Sportangebote', to: '/sport/' },
      { label: 'Fußball', to: '/fussball/' },
      { label: 'Bogenschießen', to: '/sport/bogenschiessen/' },
      { label: 'Darts', to: '/sport/darts/' },
      { label: 'Termine & Training', to: '/termine/' },
    ],
  },
  {
    title: 'Mitmachen',
    links: [
      { label: 'Mitglied werden', to: '/mitglied-werden/' },
      { label: 'Spenden', to: '/spenden/' },
      { label: 'Sponsoren', to: '/sponsoren/' },
      { label: 'Sponsor werden', to: '/sponsoren/#sponsor-werden' },
      { label: 'Vereinsleben', to: '/vereinsleben/' },
      { label: 'Galerie', to: '/galerie/' },
    ],
  },
]
