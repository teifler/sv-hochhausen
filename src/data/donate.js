/* =========================================================
   Spenden
   ---------------------------------------------------------
   Bankverbindung des Vereins – Quelle: offizieller Aufnahmeantrag /
   Beitrittserklärung des Vereins (PDF auf sportverein-hochhausen.de,
   Kopfzeile „Bank: SV Hochhausen, Sparkasse Tauberfranken“).
   IBAN-Prüfziffer geprüft (mod 97), BIC passt zur Sparkasse
   Tauberfranken. Vor dem Livegang vom Kassenwart bestätigen lassen –
   besonders den Kontoinhaber (Banken gleichen den Empfängernamen
   bei Überweisungen ab).
   Ist `iban` leer, zeigt die Spendenseite statt der Kontodaten einen
   Hinweis; der GiroCode (QR für Banking-Apps) entsteht automatisch.
   ========================================================= */

export const donate = {
  bank: {
    holder: 'SV Hochhausen',
    iban: 'DE48 6735 2565 0002 0366 22',
    bic: 'SOLADES1TBB',
    bankName: 'Sparkasse Tauberfranken',
    reference: 'Spende SV Hochhausen',
  },
  paypalUrl: null, // optional: PayPal-Spendenlink
  /* true, sobald der Verein Zuwendungsbestätigungen (Spenden-
     quittungen) ausstellen kann – bitte mit dem Kassenwart klären. */
  receipts: null,
  contactEmail: 'info@sportverein-hochhausen.de',
  suggestedAmounts: [20, 50, 100, 250],
}

/* Wofür Spenden gebraucht werden (Spendenzweck-Auswahl + Seite) */
export const donationPurposes = [
  {
    id: 'allgemein',
    title: 'Wo es am meisten hilft',
    icon: 'heart',
    text: 'Der Vorstand setzt die Spende dort ein, wo sie gerade am dringendsten gebraucht wird.',
  },
  {
    id: 'ausruestung',
    title: 'Leihausrüstung für Einsteiger',
    icon: 'bow',
    text: 'Bögen, Pfeile, Arm- und Handschutz zum Ausleihen – damit niemand für den Einstieg erst teure Ausrüstung kaufen muss.',
  },
  {
    id: 'sportplatz',
    title: 'Sportplatz & Sportheim',
    icon: 'ball',
    text: 'Platzpflege, Instandhaltung und Energie: Unsere Anlage wird zu großen Teilen ehrenamtlich gepflegt – Material und Betrieb kosten trotzdem Geld.',
  },
  {
    id: 'jugend',
    title: 'Kinder & Jugendliche',
    icon: 'users',
    text: 'Material, Turnierfahrten und Aktionen für den Nachwuchs – etwa im Bogenschießen, wo schon viele Jugendliche aktiv sind.',
  },
  {
    id: 'inklusion',
    title: 'Integration & Inklusion',
    icon: 'handshake',
    text: 'Der SVH engagiert sich für die Integration von Geflüchteten und für Sport mit Menschen mit Behinderung. Spenden helfen, Angebote offen und bezahlbar zu halten.',
  },
  {
    id: 'abteilungen',
    title: 'Trainingsmaterial',
    icon: 'dumbbell',
    text: 'Bälle, Dartscheiben, Stöcke, Matten: Jede Abteilung braucht Material, das regelmäßig ersetzt werden muss.',
  },
]
