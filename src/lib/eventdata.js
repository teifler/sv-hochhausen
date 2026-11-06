/* Termine für Modal/Kalender aufbereiten */
import { eventTypes } from '../data/events.js'
import { getVenue } from '../data/venues.js'
import { routeUrl } from '../data/site.js'
import { fmtLongWeekday, fmtTime } from './format.js'

export function eventView(e) {
  const type = eventTypes[e.type] || eventTypes.verein
  const venue = e.locationId ? getVenue(e.locationId) : null
  let note = null
  if (e.provisional) note = 'Vorläufige Ansetzung laut fussball.de – bitte kurz vorher prüfen.'
  else if (e.annual) note = 'Fester Termin im Vereinsjahr.'
  return {
    id: e.id,
    title: e.title,
    date: e.date,
    time: e.time || '',
    dateLabel: fmtLongWeekday(e.date),
    timeLabel: e.time ? fmtTime(e.time) : '',
    location: e.location || '',
    type: e.type,
    typeLabel: type.label,
    color: type.color,
    icon: type.icon,
    description: e.description || '',
    mapsUrl: venue ? routeUrl(venue.maps) : null,
    url: e.url || null,
    note,
  }
}

export function eventMap(list) {
  return Object.fromEntries(list.map((e) => [e.id, eventView(e)]))
}
