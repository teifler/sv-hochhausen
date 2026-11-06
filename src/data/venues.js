/* =========================================================
   Sportstätten & Treffpunkte
   ========================================================= */

export const venues = [
  {
    id: 'sportplatz',
    name: 'Sportplatz Hochhausen',
    theme: 'pitch',
    seed: 31,
    address: 'Zum Sportplatz 10, 97941 Tauberbischofsheim-Hochhausen',
    maps: 'Zum Sportplatz 10, 97941 Tauberbischofsheim',
    text: 'Heimspielstätte der SpG, Trainingsgelände der Fußballer und Freigelände der Bogenschützen – bei schönem Wetter trainiert hier auch die Damengymnastik.',
    tags: ['Fußball', 'Bogenschießen', 'Training'],
  },
  {
    id: 'sportheim',
    name: 'Sportheim',
    theme: 'sportheim',
    seed: 32,
    address: 'Zum Sportplatz 10, 97941 Tauberbischofsheim-Hochhausen',
    maps: 'Zum Sportplatz 10, 97941 Tauberbischofsheim',
    phone: '09341 12534',
    phoneHref: '+49934112534',
    text: 'Der Treffpunkt des Vereins direkt am Sportplatz – und Ziel der traditionellen Maiwanderung mit kühlen Getränken und Gegrilltem.',
    tags: ['Treffpunkt', 'Feiern', 'Maiwanderung'],
  },
  {
    id: 'konradsaal',
    name: 'Konradsaal',
    theme: 'hall',
    seed: 33,
    /* Adresse laut Veranstaltungskalender (moritz.de, „Konradsaal Hochhausen“) – vom Verein bestätigen lassen */
    address: 'Pfarrgasse 1, 97941 Tauberbischofsheim-Hochhausen',
    maps: 'Konradsaal, Pfarrgasse 1, 97941 Tauberbischofsheim',
    text: 'Hier trainiert die Damengymnastik dienstags und donnerstags von 19:30 bis 20:30 Uhr.',
    tags: ['Damengymnastik', 'Halle'],
  },
  {
    id: 'friedhof',
    name: 'Treffpunkt Friedhofsparkplatz',
    theme: 'nordic',
    seed: 34,
    address: 'Parkplatz am Friedhof, Hochhausen',
    maps: 'Friedhof Hochhausen, 97941 Tauberbischofsheim',
    text: 'Startpunkt für Nordic Walking und Wanderungen – auch für die Maiwanderung am 1. Mai.',
    tags: ['Nordic Walking', 'Wandern'],
  },
  {
    id: 'natur',
    name: 'Rund um Hochhausen',
    theme: 'landscape',
    seed: 35,
    address: 'Apfelberg, Großholz & Taubertal',
    maps: 'Hochhausen, 97941 Tauberbischofsheim',
    text: 'Wander- und Walkingstrecken direkt vor der Haustür – etwa rund um den Apfelberg bis zur Grillhütte im Großholz.',
    tags: ['Wandern', 'Nordic Walking', 'Natur'],
  },
]

export function getVenue(id) {
  return venues.find((v) => v.id === id) || null
}
