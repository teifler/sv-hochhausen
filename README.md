# SV Hochhausen 1946 – Vereinswebsite

Website des **Sportverein 1946 Hochhausen/Tauber e.V.** (Tauberbischofsheim-Hochhausen).
Gebaut mit [Astro](https://astro.build): statische Seiten, kaum JavaScript, sehr schnell.
Kontakt- und Spendenformular laufen als kleine Serverfunktion auf Vercel.

> ⚠️ Nicht verwechseln: Der **SV Hochhausen 1966 e.V.** (Hochhausen am Neckar, sv-hochhausen.de) ist ein anderer Verein.

## Schnellstart

```bash
npm install          # einmalig
npm run dev          # Entwicklungsserver: http://localhost:4321
npm run build:local  # Test-Build ohne Foto-/Instagram-Download
npm run build        # Produktions-Build (lädt die 7 Stockfotos + Instagram)
```

Die echten Vereinsfotos und das Wappen liegen im Repository (`src/assets/`). Die wenigen Stockfotos werden erst beim
Build (z. B. auf Vercel) geladen; ohne Internet zeigt die Seite dort gezeichnete Grafiken in Vereinsfarben.

Voraussetzung: Node.js ≥ 22.12.

## Was drin ist

| Bereich | Umsetzung |
|---|---|
| Seiten | Start, Aktuelles (+ Artikel), Verein (Vorstand, Geschichte, Sportstätten), Sport (6 Abteilungen), Fußball, Jugend, Termine & Training, Kalender (Liste/Monat), Vereinsleben, Galerie, Spenden, Mitglied werden, Sponsoren (+ Partner), Kontakt, Suche, Impressum, Datenschutz, 404 – alte Adressen der bisherigen Vereinswebsite leiten automatisch weiter |
| Fußball | Teamdaten + Tabellenstand aus fussball.de, offizielle Widgets per 2-Klick-Lösung (DSGVO) |
| Social Media | Bereich „Folge dem SVH“: Instagram-Beiträge (beim Build geladen, **lokal** ausgeliefert, kein Tracking; ohne Feed ein Bild-Teaser mit Link zu @sv_hochhausen) + Facebook-Timeline der Vereinsseite per 2-Klick |
| Formulare | Spendenseite mit Vereinskonto, Kopier-Knöpfen und GiroCode (QR für Banking-Apps); Kontakt & Spende → E-Mail per SMTP (jedes Postfach, Mailjet optional), Honeypot + Zeitsperre gegen Spam, funktioniert auch ohne JavaScript |
| Bilder | Echte Vereinsfotos (alte Website + fussball.de) > 7 geprüfte Stockfotos ohne Personen > gezeichnete Grafik; kein Foto doppelt auf einer Seite, kleine Archivfotos nie unscharf groß; Galerie nur mit echten Fotos (+ Instagram); Original-Wappen; automatisch WebP + srcset |
| Animationen | Weiche Seitenwechsel, Hero-Einstieg mit Ken-Burns-Effekt, Sport-Laufband, Scroll-Fortschritt, hochzählende Zahlen, Countdown zum nächsten Spiel, „Heute“ im Wochenplan, Hover-Effekte – alles abschaltbar über „Bewegung reduzieren“ im Betriebssystem |
| Termine | Wochenplan aller Trainings, Kalender mit Monatsansicht, `.ics`-Export |
| Suche | Index wird beim Build erzeugt (`/suche.json`), Overlay mit Tastatursteuerung (`/` oder Strg+K) |
| Datenschutz | Schriften und Bilder lokal, keine Cookies, keine Karten-Einbettung, fussball.de und Facebook erst nach Klick |

## Deployment (GitHub + Vercel)

1. **Windows:** Doppelklick auf `GITHUB-HOCHLADEN.cmd` – installiert bei Bedarf Git und GitHub CLI, meldet dich an, legt das Repository an und lädt alles hoch.
2. Auf [vercel.com/new](https://vercel.com/new) das Repository importieren → *Deploy*. Vercel erkennt Astro automatisch.
3. Umgebungsvariablen unter *Project → Settings → Environment Variables* eintragen (siehe `.env.example`), danach *Redeploy*.
4. Optional: täglicher Neubau (aktuelle Termine/Instagram) über `.github/workflows/taeglich-neu-bauen.yml` – Anleitung in `ANPASSEN.md`.

## Inhalte pflegen

Alle Inhalte liegen als einfache JavaScript-Daten in `src/data/` – **Schritt-für-Schritt-Anleitung: [`ANPASSEN.md`](ANPASSEN.md)**.
Technische Doku für Entwickler und KI-Assistenten: [`CLAUDE.md`](CLAUDE.md).

## Projektstruktur

```
src/
  data/         Inhalte (Verein, News, Termine, Sport, Vorstand, Spenden, fussball.de …)
  pages/        Seiten (+ api/contact.js, api/spende.js als Serverfunktionen)
  components/   Astro-Komponenten (Header, Karten, Formulare, Widgets …)
  layouts/      BaseLayout (Meta, Header, Footer)
  lib/          Helfer (Bilder, Platzhalter, Datum, Suche, Mail)
  scripts/      Browser-JavaScript (Menü, Suche, Kalender, Galerie, Formulare, Animationen, Einbettungen)
  styles/       Design-System (CSS-Variablen + Bausteine, parts/motion.css = Animationen)
  assets/       wappen.png, photos/ (Vereinsfotos), instagram/ (wird beim Build erzeugt)
scripts/        prebuild.mjs (Fotos/Instagram laden), github-upload.ps1
public/         favicon, Open-Graph-Bild
```
