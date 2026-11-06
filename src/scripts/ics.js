/* =========================================================
   Kalendereintrag (.ics, RFC 5545) für einen Termin
   Reine Funktionen ohne DOM – genutzt von modal.js, getestet in tests/ics.test.js.
   ========================================================= */

/* TEXT-Werte maskieren: Backslash, Semikolon, Komma, Zeilenumbruch (RFC 5545, 3.3.11) */
export function icsEscape(s = '') {
  return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
}

function pad(n) {
  return String(n).padStart(2, '0')
}

/* ev: { id, title, date: 'JJJJ-MM-TT', time?: 'HH:MM', durationMin?, location?, description? } */
export function buildIcs(ev, now = new Date()) {
  const [y, m, d] = ev.date.split('-').map(Number)
  const t = (ev.time || '').match(/(\d{1,2}):(\d{2})/)
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')
  let start
  let end
  if (t) {
    const s = new Date(y, m - 1, d, Number(t[1]), Number(t[2]))
    const e = new Date(s.getTime() + (ev.durationMin || 120) * 60000)
    const f = (x) =>
      `${x.getFullYear()}${pad(x.getMonth() + 1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`
    start = `DTSTART:${f(s)}`
    end = `DTEND:${f(e)}`
  } else {
    const next = new Date(y, m - 1, d + 1)
    start = `DTSTART;VALUE=DATE:${y}${pad(m)}${pad(d)}`
    end = `DTEND;VALUE=DATE:${next.getFullYear()}${pad(next.getMonth() + 1)}${pad(next.getDate())}`
  }
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SV Hochhausen 1946//Website//DE',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${ev.id}@sv-hochhausen-1946`,
    `DTSTAMP:${stamp}`,
    start,
    end,
    `SUMMARY:${icsEscape(ev.title)}`,
    `LOCATION:${icsEscape(ev.location || '')}`,
    `DESCRIPTION:${icsEscape(ev.description || '')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}
