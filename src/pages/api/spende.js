/* =========================================================
   POST /api/spende – Spende ankündigen → E-Mail an den Verein
   ========================================================= */
import { mailConfigured, sendFormMail } from '../../lib/mail.js'
import { EMAIL_RE, line, respond, spamCheck, text } from '../../lib/formutil.js'
import { donate } from '../../data/donate.js'

export const prerender = false

export async function POST({ request }) {
  let form
  try {
    form = await request.formData()
  } catch {
    return respond(request, 400, { ok: false, error: 'invalid' }, '/kontakt/fehler/')
  }

  const spam = spamCheck(form)
  if (spam === 'honeypot') return respond(request, 200, { ok: true, message: 'Danke!' }, '/spenden/danke/')
  if (spam) return respond(request, 429, { ok: false, error: 'spam' }, '/kontakt/fehler/')

  const choice = line(form.get('amount'), 20)
  const other = Number(line(form.get('amountOther'), 12).replace(',', '.'))
  let amount = 'offen'
  if (/^\d+$/.test(choice)) amount = `${choice} €`
  else if (choice === 'andere' && other > 0) amount = `${Math.round(other * 100) / 100} €`

  const name = line(form.get('name'), 120)
  const email = line(form.get('email'), 160)
  const phone = line(form.get('phone'), 40)
  const purpose = line(form.get('purpose'), 80) || 'Wo es am meisten hilft'
  const receipt = Boolean(form.get('receipt'))
  const street = line(form.get('street'), 160)
  const city = line(form.get('city'), 120)
  const isPublic = Boolean(form.get('public'))
  const message = text(form.get('message'), 2000)

  if (!name || !EMAIL_RE.test(email) || !form.get('consent') || (receipt && (!street || !city))) {
    return respond(request, 422, { ok: false, error: 'invalid' }, '/kontakt/fehler/')
  }
  if (!mailConfigured()) {
    return respond(request, 503, { ok: false, error: 'not_configured' }, '/kontakt/fehler/')
  }

  try {
    await sendFormMail({
      kind: 'spende',
      subject: `[Website] Spendenzusage ${amount} – ${name}`,
      replyTo: { name, address: email },
      rows: [
        ['Betrag', amount],
        ['Verwendung', purpose],
        ['Name', name],
        ['E-Mail', email],
        ['Telefon', phone],
        ['Spendenquittung gewünscht', receipt ? 'ja' : 'nein'],
        ['Anschrift', receipt ? `${street}, ${city}` : ''],
        ['Öffentliche Nennung erlaubt', isPublic ? 'ja' : 'nein'],
        ['Nachricht', message],
        ['Einwilligung Datenschutz', 'ja'],
      ],
    })
  } catch (e) {
    console.error('[spende] Versand fehlgeschlagen:', e?.message || e)
    return respond(request, 502, { ok: false, error: 'send_failed' }, '/kontakt/fehler/')
  }

  const b = donate.bank
  const msg = b.iban
    ? `<strong>Vielen Dank für deine Unterstützung!</strong> Bitte überweise den Betrag an: ${b.holder || 'Sportverein 1946 Hochhausen/Tauber e.V.'}, IBAN ${b.iban}${b.bankName ? ` (${b.bankName})` : ''}, Verwendungszweck „${b.reference}“.`
    : '<strong>Vielen Dank für deine Unterstützung!</strong> Der Verein meldet sich in Kürze mit den Überweisungsdaten bei dir.'
  return respond(request, 200, { ok: true, message: msg }, '/spenden/danke/')
}

export function GET() {
  return new Response(null, { status: 303, headers: { Location: '/spenden/' } })
}
