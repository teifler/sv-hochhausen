/* =========================================================
   Datums-/Formatierungs-Helfer (deutsch, Europe/Berlin)
   ========================================================= */

export const MONTHS = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
]
export const MONTHS_SHORT = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
export const WEEKDAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
export const WEEKDAYS_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

/* Heutiges Datum als 'YYYY-MM-DD' in deutscher Zeit */
export function todayKey(date = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(date)
}

/* 'YYYY-MM-DD' -> Date (lokal, ohne Zeitzonen-Verschiebung) */
export function toDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const dayNum = (iso) => toDate(iso).getDate()
export const monthShort = (iso) => MONTHS_SHORT[toDate(iso).getMonth()]
export const monthLong = (iso) => MONTHS[toDate(iso).getMonth()]
export const yearNum = (iso) => toDate(iso).getFullYear()
export const weekdayShort = (iso) => WEEKDAYS_SHORT[toDate(iso).getDay()]

/* 5. Mai 2027 */
export function fmtLong(iso) {
  const d = toDate(iso)
  return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

/* Samstag, 1. Mai 2027 */
export function fmtLongWeekday(iso) {
  const d = toDate(iso)
  return `${WEEKDAYS[d.getDay()]}, ${fmtLong(iso)}`
}

/* 5. Mai 2027 (Kurzmonat) */
export function fmtShort(iso) {
  const d = toDate(iso)
  return `${d.getDate()}. ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`
}

/* 19:30 -> 19:30 Uhr */
export function fmtTime(t) {
  if (!t) return ''
  return /uhr/i.test(t) ? t : `${t} Uhr`
}
