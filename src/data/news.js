/* =========================================================
   Aktuelles / Nachrichten
   ---------------------------------------------------------
   Bild = theme (+ seed für Varianten). Eigene Fotos: siehe
   ANPASSEN.md. Ältere Beiträge stammen aus den Abteilungsseiten
   der bisherigen Vereinswebsite (Daten dort belegt).
   ========================================================= */

/* Kategorie -> Akzentfarbe (für Badges/Filter) */
export const newsCategories = {
  Verein: 'var(--svh-acc-verein)',
  Fußball: 'var(--svh-acc-fussball)',
  Bogenschießen: 'var(--svh-acc-bogen)',
  Darts: 'var(--svh-acc-darts)',
  Wandern: 'var(--svh-acc-wandern)',
  Gymnastik: 'var(--svh-acc-gym)',
  'Nordic Walking': 'var(--svh-acc-nordic)',
}

export const news = [
  {
    id: 'relaunch-website',
    slug: 'neue-vereinswebsite-ist-online',
    title: 'Die neue Vereinswebsite ist online',
    category: 'Verein',
    date: '2026-10-27',
    theme: 'club',
    seed: 11,
    excerpt:
      'Frisches Design, klare Struktur und alle sechs Abteilungen auf einen Blick: Der SV Hochhausen präsentiert sich mit einer komplett neuen Website.',
    body: [
      'Pünktlich zum 80. Vereinsjahr hat der Sportverein 1946 Hochhausen seine Website rundum erneuert. Ziel ist ein moderner, übersichtlicher Auftritt, der den Verein so zeigt, wie er ist: als kompletter Sport- und Gemeinschaftsverein – weit mehr als Fußball.',
      'Neu sind unter anderem ein Wochenplan mit allen Trainingszeiten, der Vereinskalender, Spielplan und Tabelle direkt aus fussball.de, unser Instagram-Kanal auf der Startseite, eine eigene Spendenseite und ein Kontaktformular.',
      'Fotos und Inhalte werden nach und nach ergänzt. Feedback ist ausdrücklich willkommen – über das Kontaktformular oder direkt beim Vorstandsteam.',
    ],
    tags: ['website', 'relaunch', 'digital', '80 jahre'],
  },
  {
    id: 'spg-zwischenstand',
    slug: 'spg-nach-acht-spielen-auf-platz-fuenf',
    title: 'SpG nach acht Spielen auf Platz fünf',
    category: 'Fußball',
    date: '2026-10-27',
    theme: 'football',
    seed: 23,
    excerpt:
      'Die SpG Hochhausen/Tauberbischofsheim 3 steht in der Kreisklasse B Tauberbischofsheim, Staffel 2, mit zehn Punkten auf Rang fünf.',
    body: [
      'Nach acht Spielen hat die Spielgemeinschaft aus SVH und TSV 1863 Tauberbischofsheim drei Siege, ein Unentschieden und vier Niederlagen auf dem Konto. Das Torverhältnis lautet 20:24 (Stand: 27. Oktober 2026 laut fussball.de).',
      'Spielplan, Ergebnisse und die aktuelle Tabelle gibt es jederzeit auf unserer Fußballseite und bei fussball.de.',
    ],
    tags: ['fußball', 'spg', 'tabelle', 'kreisklasse b'],
  },
  {
    id: 'wanderung-apfelberg',
    slug: 'wanderung-rund-um-den-apfelberg',
    title: 'Wanderung rund um den Apfelberg',
    category: 'Wandern',
    date: '2013-07-07',
    theme: 'hiking',
    seed: 24,
    excerpt:
      '13 Wanderer, rund zweieinhalb Stunden und viel Sonne: Die Tour rund um den Apfelberg endete an der Grillhütte im Großholz.',
    body: [
      'Am 7. Juli 2013 machten sich 13 Teilnehmerinnen und Teilnehmer auf den Weg rund um den Apfelberg. Nach etwa zweieinhalb Stunden – bei großer Hitze – erreichte die Gruppe die Grillhütte im Großholz.',
      'Dort warteten Kaffee und Kuchen, organisiert von Siegfried und Elvira Siehr.',
    ],
    tags: ['wandern', 'apfelberg', 'großholz'],
  },
  {
    id: 'kids-cup-2013',
    slug: 'kids-cup-platz-zwei-fuer-felix-mechler',
    title: 'KIDS Cup: Platz zwei für Felix Mechler',
    category: 'Bogenschießen',
    date: '2013-06-15',
    theme: 'archery',
    seed: 25,
    excerpt: 'Beim 2. KIDS Cup in Bad Mergentheim holt der Bogensport-Nachwuchs des SVH einen Podestplatz.',
    body: [
      'Beim 2. KIDS Cup in Bad Mergentheim am 15. Juni 2013 belegte Felix Mechler den zweiten Platz in seiner Klasse.',
      'Schon beim ersten KIDS Cup im Juni 2012 waren zehn Jugendliche des SVH am Start – und beim 10. Jagdturnier in Collenberg im Mai 2012 hatte Felix Mechler seine Klasse gewonnen.',
    ],
    tags: ['bogenschießen', 'jugend', 'turnier', 'bad mergentheim'],
  },
  {
    id: 'bogenschiessen-start',
    slug: 'neue-abteilung-bogenschiessen',
    title: 'Neue Abteilung: Bogenschießen',
    category: 'Bogenschießen',
    date: '2009-08-15',
    theme: 'archery',
    seed: 26,
    excerpt: 'Am 15. August 2009 treffen sich die Bogenschützen des SVH zum ersten Mal.',
    body: [
      'Auf Anregung des damaligen Vorsitzenden Herbert Elsner haben Martin Schöllig und Markus Bechtold eine Bogensportabteilung ins Leben gerufen. Das erste Treffen fand am 15. August 2009 statt.',
      'Neben den anfangs von Martin Schöllig selbst gebauten Holzbögen kommen auch Recurvebögen zum Einsatz.',
    ],
    tags: ['bogenschießen', 'abteilung', 'gründung'],
  },
]

export function getArticle(slug) {
  return news.find((n) => n.slug === slug) || null
}

export const newsSorted = [...news].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
