/* =========================================================
   Sportangebote / Abteilungen des SV Hochhausen
   ---------------------------------------------------------
   Reihenfolge = Anzeige. Fußball ist bewusst nur EIN Angebot
   unter sechs. Zeiten & Ansprechpersonen laut bisheriger
   Vereinswebsite (Stand 27.10.2026). `confirm: true` markiert
   Angaben, die auf der alten Seite als älterer Stand galten
   (z. B. Bogenschießen „Stand 2017") – bitte prüfen.
   ========================================================= */

export const sports = [
  {
    slug: 'fussball',
    name: 'Fußball',
    to: '/fussball/',
    tagline: 'SpG mit dem TSV Tauberbischofsheim',
    icon: 'ball',
    theme: 'football',
    seed: 3,
    accent: 'var(--svh-acc-fussball)',
    venueId: 'sportplatz',
    intro:
      'Fußball hat in Hochhausen Tradition: Seit der Saison 2000/01 spielt der SVH in einer Spielgemeinschaft mit dem TSV 1863 Tauberbischofsheim.',
    body: [
      'In der Saison 2026/27 tritt die SpG Hochhausen/Tauberbischofsheim 3 in der Kreisklasse B Tauberbischofsheim (Staffel 2) an. Heimspielstätte ist der Sportplatz in Hochhausen.',
      'Trainiert wird während der Saison dienstags und freitags um 19 Uhr auf dem Sportgelände. Neue Spieler sind jederzeit willkommen – einfach vorbeikommen oder vorher kurz melden.',
    ],
    highlights: ['SpG mit dem TSV 1863 Tauberbischofsheim', 'Kreisklasse B Tauberbischofsheim', 'Training Di & Fr, 19 Uhr'],
    audience: 'Herren · Aktive',
    place: 'Sportgelände Hochhausen',
    schedule: [
      { day: 2, time: '19:00' },
      { day: 5, time: '19:00' },
    ],
    scheduleNote: 'während der Saison',
    lead: { role: 'Abteilungsleiter', name: 'Daniel Siehr' },
  },
  {
    slug: 'bogenschiessen',
    name: 'Bogenschießen',
    to: '/sport/bogenschiessen/',
    tagline: 'Parcours, Turniere & Schnuppern',
    icon: 'bow',
    theme: 'archery',
    seed: 4,
    accent: 'var(--svh-acc-bogen)',
    venueId: 'sportplatz',
    since: 2009,
    intro:
      'Seit 2009 gibt es beim SVH eine eigene Bogensportabteilung – für Jugendliche und Erwachsene, auf dem Vereinsgelände und bei Parcours- und Turnierwettkämpfen.',
    body: [
      'Die Abteilung entstand auf Anregung des damaligen Vorsitzenden Herbert Elsner; ins Leben gerufen haben sie Martin Schöllig und Markus Bechtold. Das erste Treffen fand am 15. August 2009 statt.',
      'Geschossen wird überwiegend auf dem Vereinsgelände am Sportplatz. Einsteiger brauchen keine eigene Ausrüstung: Bogen, Pfeile sowie Arm- und Handschutz können – solange der Vorrat reicht – beim Verein ausgeliehen werden.',
      'Die Bogenschützen waren unter anderem bei Parcours in Collenberg und beim KIDS Cup in Bad Mergentheim erfolgreich am Start.',
    ],
    highlights: ['Leihausrüstung für Einsteiger', 'Jugendliche & Erwachsene', 'Parcours & Turniere'],
    audience: 'Jugendliche & Erwachsene',
    place: 'Vereinsgelände am Sportplatz',
    schedule: [
      { day: 4, time: '18:00–20:00' },
      { day: 6, time: '15:00–17:00' },
    ],
    scheduleNote: 'In Ferien, an Feiertagen und bei Regen bitte vorher anmelden.',
    confirm: true,
    lead: { role: 'Abteilungsleiter', name: 'August Baumann' },
  },
  {
    slug: 'darts',
    name: 'Darts',
    to: '/sport/darts/',
    tagline: 'Jeden Donnerstag ab 19:30 Uhr',
    icon: 'target',
    theme: 'darts',
    seed: 5,
    accent: 'var(--svh-acc-darts)',
    venueId: null,
    since: 2019,
    intro: 'Die jüngste Abteilung des Vereins: Seit 2019 wird beim Sportverein Hochhausen Darts gespielt.',
    body: [
      'Trainiert wird jeden Donnerstag ab 19:30 Uhr – wie lange, hängt davon ab, wie viele Spielerinnen und Spieler da sind.',
      'Neugierig geworden? Zum Schnuppertraining ist jede und jeder herzlich eingeladen. Am besten vorher kurz beim Verein melden.',
    ],
    highlights: ['Seit 2019 im Verein', 'Training donnerstags ab 19:30', 'Schnuppertraining willkommen'],
    audience: 'Alle Interessierten',
    place: 'Ort bitte beim Verein erfragen',
    schedule: [{ day: 4, time: 'ab 19:30' }],
    lead: { role: 'Abteilungsleiter', name: 'Alexander Harter' },
  },
  {
    slug: 'damengymnastik',
    name: 'Damengymnastik',
    to: '/sport/damengymnastik/',
    tagline: 'Di & Do im Konradsaal',
    icon: 'activity',
    theme: 'gym',
    seed: 2,
    accent: 'var(--svh-acc-gym)',
    venueId: 'konradsaal',
    intro: 'Zweimal pro Woche heißt es im Konradsaal: Bewegung, Gymnastik und eine gute Stunde in der Gruppe.',
    body: [
      'Die Damengymnastik trifft sich dienstags und donnerstags von 19:30 bis 20:30 Uhr im Konradsaal in Hochhausen. Bei schönem Wetter geht es raus auf das Sportgelände des SVH.',
      'Trainerin ist Katja Fiedler, die Abteilung leitet Ina Herbach.',
    ],
    highlights: ['Di & Do, 19:30–20:30 Uhr', 'Konradsaal Hochhausen', 'Bei gutem Wetter im Freien'],
    audience: 'Frauen',
    place: 'Konradsaal Hochhausen',
    schedule: [
      { day: 2, time: '19:30–20:30' },
      { day: 4, time: '19:30–20:30' },
    ],
    lead: { role: 'Abteilungsleiterin', name: 'Ina Herbach' },
    trainer: 'Katja Fiedler',
  },
  {
    slug: 'nordic-walking',
    name: 'Nordic Walking',
    to: '/sport/nordic-walking/',
    tagline: 'Montags & donnerstags',
    icon: 'nordic',
    theme: 'nordic',
    seed: 6,
    accent: 'var(--svh-acc-nordic)',
    venueId: 'friedhof',
    intro: 'Mit Stöcken und guter Laune durch die Natur rund um Hochhausen – zweimal pro Woche.',
    body: [
      'Treffpunkt ist der Parkplatz am Friedhof in Hochhausen. Montags geht es von 18 bis 19 Uhr los (im Winter richtet sich der Start nach dem Tageslicht), donnerstags vormittags von 9:30 bis 10:30 Uhr.',
      'Die Abteilung leitet Jana Nentwig.',
    ],
    highlights: ['Mo 18:00 · Do 9:30 Uhr', 'Treffpunkt Friedhofsparkplatz', 'Draußen an der frischen Luft'],
    audience: 'Alle Interessierten',
    place: 'Parkplatz am Friedhof',
    schedule: [
      { day: 1, time: '18:00–19:00', note: 'im Winter je nach Tageslicht' },
      { day: 4, time: '09:30–10:30' },
    ],
    lead: { role: 'Abteilungsleiterin', name: 'Jana Nentwig' },
  },
  {
    slug: 'wandern',
    name: 'Wandern',
    to: '/sport/wandern/',
    tagline: 'Touren & Maiwanderung',
    icon: 'mountain',
    theme: 'hiking',
    seed: 7,
    accent: 'var(--svh-acc-wandern)',
    venueId: 'natur',
    since: 2012,
    intro: 'Seit Herbst 2012 erkundet die Wandergruppe des SVH gemeinsam die schönsten Wege rund um Hochhausen.',
    body: [
      'Gewandert wird in unregelmäßigen Abständen, am liebsten sonntags. Die nächsten Touren werden im Amtsblatt und im Vereinskalender angekündigt.',
      'Fester Höhepunkt ist die traditionelle Maiwanderung am 1. Mai: Start ist um 10 Uhr am Friedhofsparkplatz bzw. am Grünauer Hof. Nach rund drei Stunden klingt der Tag im Sportheim aus – mit kühlen Getränken und Gegrilltem für Wanderer und Gäste.',
    ],
    highlights: ['Touren meist sonntags', 'Maiwanderung am 1. Mai', 'Ausklang im Sportheim'],
    audience: 'Alle Interessierten',
    place: 'Rund um Hochhausen',
    schedule: [],
    scheduleText: 'unregelmäßig, meist sonntags',
    lead: { role: 'Abteilungsleiter AH/Wandern', name: 'Alois Dehn' },
  },
]

export function getSport(slug) {
  return sports.find((s) => s.slug === slug) || null
}

/* Abteilungs-Raster der Startseite („Mehr als Fußball") */
export const homeDepartments = sports

/* Wochenplan: alle regelmäßigen Trainings, Mo (1) … So (0) */
export const WEEKDAYS_LONG = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
export const WEEKDAYS_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

export const trainingSlots = sports
  .flatMap((s) =>
    (s.schedule || []).map((slot) => ({
      day: slot.day,
      time: slot.time,
      note: slot.note || null,
      sport: s.name,
      slug: s.slug,
      to: s.to,
      icon: s.icon,
      accent: s.accent,
      place: s.place,
      confirm: !!s.confirm,
    })),
  )
  .sort((a, b) => ((a.day + 6) % 7) - ((b.day + 6) % 7) || a.time.localeCompare(b.time))

/* Wochenplan gruppiert nach Tagen (Mo–So, nur Tage mit Training) */
export const weeklyPlan = [1, 2, 3, 4, 5, 6, 0]
  .map((day) => ({
    day,
    label: WEEKDAYS_LONG[day],
    short: WEEKDAYS_SHORT[day],
    slots: trainingSlots.filter((t) => t.day === day),
  }))
  .filter((d) => d.slots.length > 0)
