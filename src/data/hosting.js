/* =========================================================
   Webspace-Einstellungen (nur öffentliche Schalter, KEINE Zugangsdaten –
   die stehen ausschließlich in der lokalen .env und in GitHub-Secrets)
   ========================================================= */
export const hosting = {
  /* Alle Aufrufe auf https:// umleiten + HSTS. Erst auf true setzen, wenn das
     SSL-Zertifikat für die Domain aktiv ist – sonst ist die Seite nicht erreichbar. */
  forceHttps: false,
}
