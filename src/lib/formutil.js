/* Gemeinsame Helfer für die Formular-Endpunkte */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function text(v, max = 4000) {
  return String(v ?? '')
    .replace(/\r/g, '')
    .trim()
    .slice(0, max)
}

/* einzeilig (z. B. für Betreff/Name) – Zeilenumbrüche entfernen */
export function line(v, max = 200) {
  return text(v, max).replace(/\n+/g, ' ')
}

export function wantsJson(request) {
  return (request.headers.get('accept') || '').includes('application/json')
}

/* JSON für fetch(), sonst Weiterleitung (funktioniert ohne JavaScript) */
export function respond(request, status, body, redirectTo) {
  if (wantsJson(request)) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    })
  }
  return new Response(null, { status: 303, headers: { Location: redirectTo } })
}

/* Spamschutz: Honeypot gefüllt oder in < 3 s abgeschickt */
export function spamCheck(form) {
  if (text(form.get('website'))) return 'honeypot'
  const ts = Number(form.get('ts') || 0)
  if (ts && Date.now() - ts < 3000) return 'too_fast'
  return null
}
