/* =========================================================
   POST /api/contact – Kontaktformular → E-Mail an den Verein
   Läuft als Vercel Function (nicht vorgerendert).
   ========================================================= */
import { mailConfigured, sendFormMail } from '../../lib/mail.js'
import { EMAIL_RE, line, respond, spamCheck, text } from '../../lib/formutil.js'

export const prerender = false

const TOPICS = {
  allgemein: 'Allgemeine Anfrage',
  mitgliedschaft: 'Mitgliedschaft',
  probetraining: 'Probetraining / Schnuppern',
  sponsoring: 'Sponsoring & Werbung',
  spende: 'Spende',
  sportheim: 'Sportheim',
  presse: 'Presse & Medien',
  website: 'Website',
}

export async function POST({ request }) {
  let form
  try {
    form = await request.formData()
  } catch {
    return respond(request, 400, { ok: false, error: 'invalid' }, '/kontakt/fehler/')
  }

  const spam = spamCheck(form)
  if (spam === 'honeypot') return respond(request, 200, { ok: true, message: 'Danke!' }, '/kontakt/danke/')
  if (spam) return respond(request, 429, { ok: false, error: 'spam' }, '/kontakt/fehler/')

  const name = line(form.get('name'), 120)
  const email = line(form.get('email'), 160)
  const phone = line(form.get('phone'), 40)
  const topic = TOPICS[line(form.get('topic'), 40)] || TOPICS.allgemein
  const department = line(form.get('department'), 60)
  const message = text(form.get('message'), 4000)
  const consent = form.get('consent')

  if (!name || !EMAIL_RE.test(email) || message.length < 10 || !consent) {
    return respond(request, 422, { ok: false, error: 'invalid' }, '/kontakt/fehler/')
  }
  if (!mailConfigured()) {
    return respond(request, 503, { ok: false, error: 'not_configured' }, '/kontakt/fehler/')
  }

  try {
    await sendFormMail({
      kind: 'kontakt',
      subject: `[Website] ${topic}${department ? ` · ${department}` : ''} – ${name}`,
      replyTo: { name, address: email },
      rows: [
        ['Anliegen', topic],
        ['Abteilung', department],
        ['Name', name],
        ['E-Mail', email],
        ['Telefon', phone],
        ['Nachricht', message],
        ['Einwilligung Datenschutz', 'ja'],
      ],
    })
  } catch (e) {
    console.error('[contact] Versand fehlgeschlagen:', e?.message || e)
    return respond(request, 502, { ok: false, error: 'send_failed' }, '/kontakt/fehler/')
  }

  return respond(
    request,
    200,
    { ok: true, message: '<strong>Danke, deine Nachricht ist angekommen!</strong> Wir melden uns so bald wie möglich bei dir.' },
    '/kontakt/danke/',
  )
}

export function GET() {
  return new Response(null, { status: 303, headers: { Location: '/kontakt/' } })
}
