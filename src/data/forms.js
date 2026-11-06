/* =========================================================
   Formulare (Kontakt & Spende)
   ---------------------------------------------------------
   Die Formulare laufen als PHP auf dem Webspace (public/api/*.php)
   und verschicken E-Mails über die Mailfunktion des Webspace –
   ohne Postfach-Passwort. Diese Werte landen beim Build in
   /api/config.json (für Besucher gesperrt, siehe .htaccess).
   Nur öffentliche Vereinsadressen eintragen, keine Zugangsdaten.
   ========================================================= */
import { contact } from './site.js'

export const formMail = {
  /* Empfänger der Kontaktanfragen */
  to: contact.main.email,
  /* Empfänger der Spendenzusagen (gleiches Postfach) */
  donationTo: contact.main.email,
  /* Absender – muss ein Postfach der Vereinsdomain sein */
  from: contact.main.email,
  fromName: 'SV Hochhausen Website',
}

/* Anliegen im Kontaktformular: Wert → Bezeichnung */
export const contactTopics = [
  ['allgemein', 'Allgemeine Anfrage'],
  ['mitgliedschaft', 'Mitgliedschaft'],
  ['probetraining', 'Probetraining / Schnuppern'],
  ['sponsoring', 'Sponsoring & Werbung'],
  ['spende', 'Spende'],
  ['sportheim', 'Sportheim'],
  ['presse', 'Presse & Medien'],
  ['website', 'Website'],
]

/* Formular-Adressen (PHP-Endpunkte) */
export const formActions = {
  contact: '/api/contact.php',
  donation: '/api/spende.php',
}
