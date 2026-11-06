/* Konfiguration für die PHP-Formulare (wird als /api/config.json gebaut) */
import { donate } from '../data/donate.js'
import { contactTopics, formMail } from '../data/forms.js'

export function formConfig() {
  const b = donate.bank
  return {
    mailTo: formMail.to,
    donationTo: formMail.donationTo || formMail.to,
    mailFrom: formMail.from,
    fromName: formMail.fromName,
    topics: Object.fromEntries(contactTopics),
    bank: b.iban
      ? {
          holder: b.holder || 'Sportverein 1946 Hochhausen/Tauber e.V.',
          iban: b.iban,
          bankName: b.bankName || '',
          reference: b.reference || '',
        }
      : null,
  }
}
