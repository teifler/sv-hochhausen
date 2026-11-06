# CLAUDE.md – Technische Projektdoku (für Entwickler & KI-Assistenten)

## 1. Was ist das?
Relaunch der Website des **Sportverein 1946 Hochhausen/Tauber e.V.**
(Zum Sportplatz 10, 97941 Tauberbischofsheim-Hochhausen, Amtsgericht Mannheim VR 560044,
Vereinsfarben laut fussball.de: blau/schwarz/rot, ca. 280 Mitglieder, 6 Abteilungen).

**Verwechslungsgefahr:** „SV Hochhausen 1966 e.V.“ (Hochhausen am Neckar / Haßmersheim, sv-hochhausen.de,
Fußballkreis Mosbach) ist ein ANDERER Verein. Keine Inhalte von dort übernehmen.
Quellen für Vereinsdaten: sportverein-hochhausen.de (alte Website des Vereins), fussball.de-Vereinsseite
(`00ES8GN9A000009DVV0AG08LVUPGND5I`), tsv-1863.de (SpG-Partner). Stand 27.10.2026.

Leitprinzip: **„Mehr als Fußball“** – alle sechs Abteilungen (Fußball, Bogenschießen, Darts, Damengymnastik,
Nordic Walking, Wandern) gleichwertig darstellen. **Keine Daten erfinden**; Unbekanntes als Platzhalter markieren
(z. B. Bankdaten in `donate.js` = `null`, Impressum § 18 MStV = Badge „Bitte ergänzen“).
UX-Inspiration: SC Freiburg, Eintracht Frankfurt, FC St. Pauli – **kein** Code/Text/Bild von dort,
**keine** Bilder oder Logos anderer Vereine.

## 2. Stack
- **Astro 7.4** (Rust-Compiler), Ausgabe statisch; Adapter **@astrojs/vercel 11** für die API-Routen.
- `@astrojs/sitemap`, `nodemailer` (SMTP), Fontsource (Inter Variable, Barlow Condensed 500/600/700) – Schriften lokal.
- Kein UI-Framework. Interaktivität = Vanilla-JS-Module in `src/scripts/`, eingebunden über `<script>` in Komponenten
  (Astro bündelt & dedupliziert). Progressive Enhancement: `html.js`-Klasse wird inline im `<head>` gesetzt.
- Node ≥ 22.12.

### Astro-7-Eigenheiten (wichtig!)
- Der Rust-Compiler ist **strikt bei HTML**: kein `<div>`/`<h3>` in `<button>`/`<span>`/`<p>`, alle Tags schließen,
  `<p>` nicht in `<dl>`. Für Inhalte in Buttons `<span>`-Elemente mit `display:block` per CSS verwenden.
- `compressHTML` ist standardmäßig `'jsx'` → **JSX-Whitespace-Regeln**: Text und Element in getrennten Zeilen
  verlieren das Leerzeichen dazwischen. Inline-Inhalte in eine Zeile schreiben oder `{' '}` verwenden.
- `set:html` nur mit explizitem Schluss-Tag (`<script ... set:html={x}></script>`).
- Keine Datei `src/fetch.js` anlegen (Namenskonflikt beim Bundling).
- `import.meta.glob` liefert `{}`, wenn Dateien fehlen → genutzt für optionale Fotos/Instagram.

## 3. Befehle
| Befehl | Zweck |
|---|---|
| `npm run dev` | Dev-Server (API-Routen funktionieren, SMTP aus `.env`) |
| `npm run build` | `prebuild.mjs` (Pexels + Instagram laden) → `astro build` |
| `npm run build:local` | Build ohne Downloads (SVG-Platzhalter) – für Sandbox/CI ohne Netz |
| `npm run photos` | nur Fotos/Instagram laden |
Build-Ausgabe: `.vercel/output/static` (statisch) + `.vercel/output/functions` (API).

## 4. Architektur
- `src/data/*.js` – **einzige Inhaltsquelle** (CMS-tauglich, reine Objekte/Arrays):
  `site.js` (Stammdaten, Kontakt, Socials, Navigation, Footer), `news.js`, `events.js` (Termine; Spiele werden aus
  `fussballde.js → fixtures` erzeugt), `sports.js` (Abteilungen inkl. `schedule` → Wochenplan `weeklyPlan`),
  `people.js` (3 Vorsitzende, Ämter, Abteilungsleitungen), `history.js`, `venues.js`, `gallery.js`,
  `documents.js` (PDFs, derzeit auf alter Website verlinkt), `partners.js` (`sponsors` + `partners`), `redirects.js`, `donate.js` (Vereinskonto aus dem Aufnahmeantrag, IBAN-Prüfziffer geprüft), `membership.js` (Jahresbeiträge),
  `fussballde.js` (Team, Tabellenstand, Widgets, Spiele), `teams.js` (Helfer `nextMatch`, `upcomingFixtures`).
- Datum: `lib/format.js` (`todayKey()` = heutiges Datum in Europe/Berlin). „Kommende Termine“ werden **beim Build**
  berechnet → täglicher Neubau per GitHub Action + Vercel Deploy Hook.
- Bilder: `components/Pic.astro` → `lib/photos.js`. Reihenfolge: eigenes Foto `src/assets/photos/<thema>[-…].jpg`
  > Stockfoto (`lib/pexels.js`, nur 7 IDs, alle visuell geprüft: keine Personen/Logos) > `lib/placeholder.js` (SVG-Grafik).
  Regeln: (1) **einmal pro Seite** – `usedOnPage(Astro.request)` (WeakMap je Seitenaufruf); erschöpft → Grafik, keine
  Wiederholung. (2) **Größen-Check**: Foto nur, wenn `meta.width ≥ width × minScale` (Standard 0.6, Abteilungs-Streifen 0.45).
  (3) `-poster` im Dateinamen = Bild mit eingebrannter Schrift → nie bei `clean` (Hero, Seitenkopf, CTA, Sportkarten,
  Mosaik); bei nicht-clean Slots kommen Poster zuerst (neueste Saison). (4) Bestes zuerst: eigene Fotos nach Größe, Stock in kuratierter Reihenfolge.
  Props: `clean`, `photo={false}` (immer Grafik – z. B. Sportstätten-Karten, Instagram-Teaser, Start-Mosaik), `minScale`.
  Vereinsfotos stammen von der alten Website (sportverein-hochhausen.de) bzw. fussball.de (Teamfoto 2024/25); Titel/Datum/
  Unterschrift in `data/gallery.js`. Galerie (`lib/gallery.js`) = alle eigenen Fotos + Instagram, ohne Stock; Startseite
  „Momente“ = 8 neueste (Bereich erst ab 4 Fotos). Fußballseite zeigt das neueste Poster als Mannschaftsfoto.
  Pexels-Dateien sind in `.gitignore`, `scripts/prebuild.mjs` lädt sie beim Build (Vercel). Jedes Bild hat `svh-img`.
  **Vorschau-Modus** `SVH_HOTLINK=1 npm run build:local`: Stockfotos vom Pexels-CDN mit `onerror`-Fallback auf die Grafik –
  nur für Vorschau-Dateien, nie für die Live-Seite (Datenschutz: keine Drittanfragen).
- Wappen: `src/assets/wappen.png` (Original, transparent, 201×240) → `components/Logo.astro` (WebP 1x/2x/3x, Fallback
  gezeichneter Platzhalter). Abgeleitet: `public/wappen.png` (JSON-LD), `public/favicon.ico`, `favicon-192.png`,
  `apple-touch-icon.png`, `public/og.jpg` (1200×630).
- Instagram: `prebuild.mjs` lädt Behold-JSON (`INSTAGRAM_FEED_URL`) oder Graph API (`INSTAGRAM_TOKEN`), speichert Bilder +
  `feed.json` in `src/assets/instagram/` (gitignored); `lib/instagram.js` + `components/InstagramFeed.astro`.
  Ohne Daten: Teaser (6–8 Stockfoto-Kacheln, `aria-hidden`, + Karte mit Profil-Link). Build bricht nie ab.
- Social: `components/SocialSection.astro` (`#social`, Start + Aktuelles) = InstagramFeed + `components/FacebookFeed.astro`
  (Page-Plugin-iframe der Vereinsseite `socials.facebook`, 2-Klick). Ohne Facebook-URL einspaltig.
- Externe Einbettungen generisch: `scripts/embeds.js` – Container `[data-embed="<key>"]` mit `[data-embed-consent]`,
  Button `[data-embed-load]`, Checkbox `[data-embed-remember]` (localStorage `svh-consent-<key>`, aktuell `fussballde`,
  `facebook`), Ziel `[data-embed-slot]` mit `<template>`. `<script>`-Tags werden **sequenziell** neu erzeugt
  (extern → onload → inline). Schlüssel stehen auch in der Datenschutzerklärung.
- fussball.de: `components/FussballDe.astro` (nutzt `embeds.js`). Widget-Code steht als String in
  `fussballde.widgets[].embedHtml` und wird in `<template>` gerendert, erst nach Klick geklont.
  Ohne Widget-Code: Link-Kacheln zu fussball.de. Der Tabellenstand `standing` ist statisch (Stand-Datum anzeigen!).
- Animationen: `styles/parts/motion.css` (zuletzt importiert) + `scripts/motion.js` (aus `site.js` importiert).
  View Transitions (`@view-transition`), Hero-Einstieg (gestaffelt) + Ken Burns (`.svh-hero__bg img`, `.svh-pagehero__bg img`),
  Titel-Schimmer, Scroll-Hinweis, Laufband `.svh-ticker`, Scroll-Fortschritt (`--svh-p` auf `<html>` → Header-Leiste
  `.svh-progress` + Ring `.svh-totop__ring`), Button-Lichtkante, Karten-Spotlight (`--mx/--my`), Zähler `[data-count]`,
  Countdown `[data-countdown="JJJJ-MM-TTTHH:MM"]`, Wochenplan `[data-weekday]` → `.is-today`, Parallax `[data-parallax]`.
  **Achtung:** auf `.svh-img` nie `animation: none` setzen (würde Ken Burns überschreiben) – Einblenden läuft über
  `.js .svh-img:not(.is-loaded)`. Alles respektiert `prefers-reduced-motion`.
- Spenden: `pages/spenden.astro` – Bankbox (gestapelte Zeilen, Kopier-Knöpfe nur Symbol + „Kopiert“-Blase) und
  `components/GiroCode.astro` (EPC069-12-QR via `qrcode`, Level M; Payload BCD/002/1/SCT/BIC/Name/IBAN/…/Verwendungszweck,
  steht zusätzlich in `data-girocode`; Test dekodiert den QR mit jsQR und vergleicht).
- Formulare: `components/ContactForm.astro`, `DonationForm.astro`, `scripts/forms.js` (fetch mit `Accept: application/json`).
  API: `pages/api/contact.js`, `pages/api/spende.js` (`prerender = false`), Helfer `lib/formutil.js`, `lib/mail.js`.
  Antworten: JSON `{ok, error}` (Codes `not_configured` 503, `invalid` 422, `spam` 429, `send_failed` 502) bzw. ohne JS
  303-Redirect auf `/kontakt/danke/`, `/spenden/danke/`, `/kontakt/fehler/`. Spam: Honeypot `website` (gibt still „ok“ zurück),
  Zeitsperre `ts` < 3 s. Header-Injection: einzeilige Felder via `line()`.
- Suche: `lib/search.js` baut den Index → `pages/suche.json.js`; Client `scripts/searchcore.js` (Normalisierung ä→a usw.),
  Overlay in `scripts/site.js`, Seite `pages/suche.astro`. `hrefFor()` + `window.SVH_ROOT` nur für die relative Vorschau-Version.
- Modal/Kalender: `components/EventModal.astro` (JSON in `#svh-events-data`) + `scripts/modal.js` (ICS-Export),
  `pages/kalender.astro` + `scripts/calendar.js` (Monatsansicht inkl. Trainings aus `trainingSlots`).
- Filter-Chips generisch: `[data-filter-group][data-filter-target]` + Items `[data-filter-cat]` (in `scripts/site.js`).
- Sponsoren: Seite `pages/sponsoren.astro` (gleiche URL wie auf der alten Website; früher `/partner/`), Karte
  `components/cards/SponsorCard.astro` (Logo aus `src/assets/sponsors/<id>.(png|jpg|webp)` → WebP, sonst `logo`-Pfad aus
  `public/`, sonst neutrale Schriftkachel – **kein nachgebautes Markenlogo**). Startseite: Leiste „Danke an unsere Sponsoren“
  (`compact`) + Einladungskachel. Suche indexiert Sponsoren.
- Weiterleitungen: `data/redirects.js` → `pages/[...legacy].astro` erzeugt statische Seiten mit Meta-Refresh + `location.replace`
  + canonical, `noindex`; aus der Sitemap gefiltert (astro.config). Bewusst **nicht** Astro-`redirects`: die erzeugten
  Vercel-Routen matchen nur ohne Schrägstrich am Ende (`^/der-verein$`), alte Links haben aber einen.

## 5. Design-System
- Präfix **`svh-`**, BEM-artig (`svh-card__title`, `svh-btn--primary`). Tokens in `src/styles/variables.css`
  (Rot `--svh-red #c8102e`, Blau `--svh-blue #1d4fb8`, Ink `#171a20`, `--svh-tricolor` = Vereinsstreifen).
- Reihenfolge der Bausteine: `src/styles/global.css`. Neue Bausteine in `parts/extras.css` ergänzen.
- Breakpoints: Desktop-Navigation ab 1101 px (darunter Burger), Raster 1000/820/560 px, keine horizontale Scrollbar (360–1536 px getestet).
- Wappen = Original (siehe Abschnitt 4); `img.svh-logo` mit `object-fit: contain` in quadratischen Boxen.
- Einblenden beim Scrollen: `.js .svh-reveal` (+ `--zoom`, `data-delay`) per IntersectionObserver; weitere Effekte siehe
  „Animationen“ in Abschnitt 4. Nur `transform`/`opacity` animieren; `prefers-reduced-motion` wird respektiert.
- Scroll-Hinweis im Hero sitzt rechts unten (ab 1000 px), damit er die linksbündigen Inhalte nie überdeckt.

## 6. Qualität / Tests (so wurde geprüft)
- Build: `npm run build:local` muss ohne Fehler durchlaufen.
- Statischer Server auf `.vercel/output/static`; Playwright: alle Seiten bei 360/390/768/1024/1280/1536 px ohne Overflow und ohne
  Konsolenfehler; Interaktionen (Mobile-Menü inkl. Fokus/Escape, Dropdown, Suche, Modal + ICS, Kalender-Monatsansicht, Galerie-Lightbox,
  Filter, Kopieren, Formular-Logik); Motion (Laufband, keine externen Requests beim Laden, Zähler-Endwerte, Bilder geladen,
  `--svh-p`, „Heute“, Countdown, Instagram-Teaser, Facebook-iframe erst nach Zustimmung, Hover-Unterstreichung,
  reduzierte Bewegung, Ken Burns aktiv, Scroll-Hinweis ohne Überlappung).
- API: `astro dev` + lokaler SMTP-Testserver (smtp-server) → Kontakt/Spende, Honeypot, Zeitsperre, Validierung, Redirects, Header-Injection.
- Link-Check: keine `href="#"`, alle internen Links/Anker existieren.

## 7. Offene Punkte (vom Verein zu liefern)
Bestätigung Bankverbindung/Kontoinhaber durch den Kassenwart, fussball.de-Widget-Code, Instagram-Feed-URL/Token, SMTP-Zugang, verantwortliche Person
nach § 18 MStV (Impressum), Wappen als Vektordatei (optional), mehr/aktuelle Fotos, aktuelle News/Termine (alte Seiten „Aktuelles“/„Termine“ waren nicht
auslesbar), Sponsorenliste der alten Seite (WebFetch auf /sponsoren/ scheitert) + Sponsor-Logos, Bestätigung Konradsaal Pfarrgasse 1, Prüfung der Datenschutzerklärung, Bogenschießen-Trainingszeiten (Stand 2017),
Einverständnis der abgebildeten Personen für die übernommenen Vereinsfotos.
