/* =========================================================
   E-Mail-Versand für Formulare (Server, Vercel Function)
   ---------------------------------------------------------
   Funktioniert mit JEDEM SMTP-Postfach (z. B. IONOS-Postfach
   des Vereins, Gmail, Mailjet als SMTP-Relay). Zugangsdaten
   ausschließlich als Umgebungsvariablen (siehe .env.example).
   ========================================================= */
import nodemailer from 'nodemailer'

function env(name, fallback = '') {
  const v = (typeof process !== 'undefined' && process.env ? process.env[name] : undefined) ?? import.meta.env?.[name]
  return v === undefined || v === null || v === '' ? fallback : String(v)
}

export function mailConfigured() {
  return Boolean(env('SMTP_HOST') && env('SMTP_USER') && env('SMTP_PASS'))
}

export function recipients(kind = 'kontakt') {
  const fallback = env('MAIL_TO', 'info@sportverein-hochhausen.de')
  if (kind === 'spende') return env('DONATION_TO', fallback)
  return fallback
}

let transporter
function getTransport() {
  if (!transporter) {
    const port = Number(env('SMTP_PORT', '587'))
    transporter = nodemailer.createTransport({
      host: env('SMTP_HOST'),
      port,
      secure: env('SMTP_SECURE', port === 465 ? 'true' : 'false') === 'true',
      auth: { user: env('SMTP_USER'), pass: env('SMTP_PASS') },
    })
  }
  return transporter
}

export function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

/** rows: [[Label, Wert], …] */
export async function sendFormMail({ kind, subject, rows, replyTo }) {
  const from = env('MAIL_FROM', env('SMTP_USER'))
  const text = rows.map(([k, v]) => `${k}: ${v || '–'}`).join('\n')
  const html =
    `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><th align="left" valign="top" style="background:#f4f6f9;border:1px solid #e7e9ee">${escapeHtml(k)}</th>` +
          `<td style="border:1px solid #e7e9ee;white-space:pre-wrap">${escapeHtml(v || '–')}</td></tr>`,
      )
      .join('') +
    `</table><p style="font-family:Arial,sans-serif;font-size:12px;color:#697180">Gesendet über das Formular auf der Vereinswebsite.</p>`
  await getTransport().sendMail({ from, to: recipients(kind), replyTo, subject, text, html })
}
