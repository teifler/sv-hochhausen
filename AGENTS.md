# AGENTS.md – Projektleitfaden für KI-Agenten & Entwickler

Zentrale technische Doku des Projekts. Gilt für alle Assistenten (Claude Code, Codex, Cursor, Copilot, Gemini …) und für
Menschen. `CLAUDE.md` bindet diese Datei nur ein. Inhaltspflege für Vereinsmitglieder: [`ANPASSEN.md`](ANPASSEN.md).

## Auf einen Blick

|              |                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| Projekt      | Website des **Sportverein 1946 Hochhausen/Tauber e.V.**                                                    |
| Stack        | Astro 7.4 (rein statisch) · Vanilla-JS · CSS-Custom-Properties · Formulare als PHP auf dem Webspace        |
| Node         | **24.22.2** laut `.nvmrc` (`nvm use`); erlaubt `>=22.23.4 <23 \|\| >=24.22.1` (Brotli-Fix CVE-2026-111497) |
| Inhalte      | ausschließlich `src/data/*.js`                                                                             |
| Qualität     | Prettier · ESLint (inkl. a11y) · Vitest · Husky + lint-staged + commitlint · GitHub Actions                |
| Fertig heißt | `npm run validate`, `npm run build:local` und `npm run test:e2e` laufen fehlerfrei                         |
| Hosting      | Apache-Webspace mit PHP; Upload per SFTP aus GitHub Actions (Abschnitt 9)                                  |

## 1. Was ist das?

Relaunch der Website des **Sportverein 1946 Hochhausen/Tauber e.V.**
(Zum Sportplatz 10, 97941 Tauberbischofsheim-Hochhausen, Amtsgericht Mannheim VR 560044,
Vereinsfarben laut fussball.de: blau/schwarz/rot, ca. 280 Mitglieder, 6 Abteilungen).

**Verwechslungsgefahr:** „SV Hochhausen 1966 e.V.“ (Hochhausen am Neckar / Haßmersheim, sv-hochhausen.de,
Fußballkreis Mosbach) ist ein ANDERER Verein. Keine Inhalte von dort übernehmen.
Quellen für Vereinsdaten: sportverein-hochhausen.de (alte Website des Vereins), fussball.de-Vereinsseite
(`00ES8GN9A000009DVV0AG08LVUPGND5I`), tsv-1863.de (SpG-Partner). Stand 27.10.2026.

Leitprinzip: **„Mehr als Fußball“** – alle sechs Abteilungen (Fußball, Bogenschießen, Darts, Damengymnastik,
Nordic Walking, Wandern) gleichwertig darstellen.

## 2. Goldene Regeln

1. **Öffentliches Repository – keine Zugangsdaten.** Niemals in Dateien, Commit-Nachrichten, Branch-Namen, Issues,
   Pull Requests oder Workflow-Ausgaben: Passwörter, Schlüssel, Tokens, Loginnamen, Server-/Hostnamen, IP-Adressen,
   Ports, Verzeichnispfade oder Account-/Paketnamen von Webspace, FTP/SFTP, Postfach/SMTP und Hosting-Verwaltung.
   Echte Werte nur in der lokalen `.env` (gitignored) und als GitHub-Secrets; Code und Workflows sprechen sie nur über
   den Namen an (`${{ secrets.DEPLOY_HOST }}`). `.env.example` enthält nur leere Variablen. In Workflows nichts
   ausgeben, was Verbindungsdaten enthält (kein `set -x`, kein `echo`). Ist doch etwas im Repo gelandet: sofort
   melden, Zugang ändern (Passwort/Schlüssel tauschen), Historie bereinigen. Secret Scanning und Push-Schutz sind
   aktiv, erkennen aber weder Hostnamen noch normale Passwörter. Lokal blockiert der Husky-Wächter
   (`scripts/check-staged.mjs`) `.env`-Dateien, private Schlüssel, `passwort = …`-Zeilen, Dateien > 50 MB und **jeden Wert
   aus der lokalen `.env`** in Dateien und Commit-Nachrichten – trotzdem selbst aufpassen.
2. **Keine Daten erfinden.** Unbekanntes als Platzhalter markieren (z. B. Bankdaten in `donate.js` = `null`,
   Impressum § 18 MStV = Badge „Bitte ergänzen“). Lieber eine Lücke als eine falsche Telefonnummer.
3. **Keine fremden Inhalte.** UX-Inspiration: SC Freiburg, Eintracht Frankfurt, FC St. Pauli – aber **kein**
   Code/Text/Bild von dort, **keine** Bilder oder Logos anderer Vereine, **keine** nachgebauten Sponsor-Logos.
4. **Datenschutz:** Beim Laden einer Seite keine Anfragen an Dritte. Schriften und Bilder lokal; externe Inhalte
   (fussball.de, Facebook) nur per 2-Klick über `scripts/embeds.js`; neue Dienste in der Datenschutzerklärung ergänzen.
5. **Progressive Enhancement:** Alles muss ohne JavaScript benutzbar sein (Formulare posten auch ohne JS).
6. **Barrierefreiheit:** semantisches HTML, Fokus sichtbar, `prefers-reduced-motion` respektieren.
   ESLint prüft a11y-Regeln in `.astro`-Dateien.
7. Vor dem Abschluss einer Aufgabe: `npm run validate` und `npm run build:local`.

## 3. Stack

- **Astro 7.4** (Rust-Compiler), Ausgabe rein statisch nach `dist/` (kein Adapter). Beim Build entsteht zusätzlich die
  `.htaccess` (Integration in `astro.config.mjs`, Inhalt aus `src/lib/htaccess.js`).
- **Webspace:** Apache + PHP (≥ 7.4). Kontakt- und Spendenformular sind PHP-Dateien in `public/api/` (Abschnitt 6.5).
- `@astrojs/sitemap`, `qrcode` (GiroCode), Fontsource (Inter Variable, Barlow Condensed 500/600/700) –
  Schriften lokal.
- Kein UI-Framework. Interaktivität = Vanilla-JS-Module in `src/scripts/`, eingebunden über `<script>` in Komponenten
  (Astro bündelt & dedupliziert). Progressive Enhancement: `html.js`-Klasse wird inline im `<head>` gesetzt.
- Frontmatter der `.astro`-Dateien nutzt etwas TypeScript (`interface Props`), der Rest ist JavaScript (ESM).

### Astro-7-Eigenheiten (wichtig!)

- Der Rust-Compiler ist **strikt bei HTML**: kein `<div>`/`<h3>` in `<button>`/`<span>`/`<p>`, alle Tags schließen,
  `<p>` nicht in `<dl>`. Für Inhalte in Buttons `<span>`-Elemente mit `display:block` per CSS verwenden.
- `compressHTML` ist standardmäßig `'jsx'` → **JSX-Whitespace-Regeln**: Text und Element in getrennten Zeilen
  verlieren das Leerzeichen dazwischen. Inline-Inhalte in eine Zeile schreiben oder `{' '}` verwenden.
  (Prettier wurde darauf geprüft: Formatieren ändert den gerenderten Text nicht – siehe Abschnitt 8.)
- `set:html` nur mit explizitem Schluss-Tag (`<script ... set:html={x}></script>`).
- Keine Datei `src/fetch.js` anlegen (Namenskonflikt beim Bundling).
- `import.meta.glob` liefert `{}`, wenn Dateien fehlen → genutzt für optionale Fotos/Instagram.
- HTML-Kommentare (`<!-- -->`) landen in der Ausgabe; für Notizen im Template `{/* … */}` verwenden.

## 4. Befehle

| Befehl                                      | Zweck                                                                                        |
| ------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `npm run dev`                               | Dev-Server http://localhost:4321 (Formulare brauchen PHP – lokal nur per `test:e2e` mit PHP) |
| `npm run build`                             | `prebuild.mjs` (Pexels + Instagram laden) → `astro build`                                    |
| `npm run build:local`                       | Build ohne Downloads (SVG-Platzhalter) – für Sandbox/CI ohne Netz                            |
| `npm run photos`                            | nur Fotos/Instagram laden                                                                    |
| `npm run validate`                          | Prettier-Check + ESLint + Unit-Tests (wie die CI)                                            |
| `npm run format` / `format:check`           | Prettier schreiben / prüfen                                                                  |
| `npm run lint` / `lint:fix`                 | ESLint (JS + Astro + a11y)                                                                   |
| `npm test` / `test:watch` / `test:coverage` | Vitest                                                                                       |
| `npm run test:e2e` / `test:e2e:ui`          | Playwright gegen `dist/` (vorher `build:local`); mit PHP auch die Formulare                  |
| `npm run check`                             | `astro check` (Typen) – derzeit nicht fehlerfrei, siehe Abschnitt 11                         |

Build-Ausgabe: `dist/` – genau das wird auf den Webspace gespiegelt (inkl. `.htaccess` und `api/*.php`).
Umgebungsvariablen: Vorlage `.env.example` (lokal als `.env` kopieren; `.env` ist in `.gitignore`). Echte Werte nie
committen – siehe Regel 1.

## 5. Projektstruktur

```
src/
  data/         Inhalte – einzige Inhaltsquelle (siehe 6.1)
  pages/        Seiten + api/config.json.js (Einstellungen für die PHP-Formulare)
  components/   Astro-Komponenten (Header, Karten in cards/, Formulare, Widgets …)
  layouts/      BaseLayout.astro (Meta, JSON-LD, Header, Footer)
  lib/          Build-Helfer (Bilder, Platzhalter, Datum, Suche, .htaccess, Formular-Konfiguration)
  scripts/      Browser-Module (Menü, Suche, Kalender, Galerie, Formulare, Animationen, Einbettungen, ICS)
  styles/       Design-System (variables.css, global.css → parts/*.css, motion.css zuletzt)
  assets/       wappen.png, photos/ (Vereinsfotos), sponsors/, instagram/ (beim Build erzeugt, gitignored)
tests/          Vitest-Unit-Tests (reine Module + Daten-Plausibilität), e2e/ (Playwright + PHP-Router)
scripts/        prebuild.mjs (Fotos/Instagram laden), github-upload.ps1 (Windows-Upload)
public/         Favicons, og.jpg, wappen.png (JSON-LD), api/*.php (Formulare)
.github/        CI, Deploy, Dependabot, Issue-/PR-Vorlagen, CODEOWNERS
```

## 6. Architektur

### 6.1 Inhalte (`src/data/*.js`)

Reine Objekte/Arrays, CMS-tauglich: `site.js` (Stammdaten, Kontakt, Socials, Navigation, Footer), `news.js`,
`events.js` (Termine; Spiele werden aus `fussballde.js → fixtures` erzeugt), `sports.js` (Abteilungen inkl. `schedule` →
Wochenplan `weeklyPlan`, `trainingSlots`), `people.js` (3 Vorsitzende, Ämter, Abteilungsleitungen), `history.js`,
`venues.js`, `gallery.js`, `documents.js` (PDFs, derzeit auf alter Website verlinkt), `partners.js` (`sponsors` +
`partners`), `redirects.js`, `donate.js` (Vereinskonto aus dem Aufnahmeantrag, IBAN-Prüfziffer per Test geprüft),
`membership.js` (Jahresbeiträge), `fussballde.js` (Team, Tabellenstand, Widgets, Spiele), `teams.js` (Helfer
`nextMatch`, `upcomingFixtures`).

- Datum: `lib/format.js` (`todayKey()` = heutiges Datum in Europe/Berlin). „Kommende Termine“ werden **beim Build**
  berechnet → die Seite muss regelmäßig neu gebaut werden (täglicher Build).
- `tests/data.test.js` prüft u. a. IBAN, Weiterleitungsziele inkl. Anker, eindeutige Slugs und Trainingszeiten –
  nach Datenänderungen `npm test` laufen lassen.

### 6.2 Bilder

`components/Pic.astro` → `lib/photos.js`. Reihenfolge: eigenes Foto `src/assets/photos/<thema>[-…].jpg`

> Stockfoto (`lib/pexels.js`, nur 7 IDs, alle visuell geprüft: keine Personen/Logos) > `lib/placeholder.js` (SVG-Grafik).

Regeln: (1) **einmal pro Seite** – `usedOnPage(Astro.request)` (WeakMap je Seitenaufruf); erschöpft → Grafik, keine
Wiederholung. (2) **Größen-Check**: Foto nur, wenn `meta.width ≥ width × minScale` (Standard 0.6, Abteilungs-Streifen
0.45). (3) `-poster` im Dateinamen = Bild mit eingebrannter Schrift → nie bei `clean` (Hero, Seitenkopf, CTA,
Sportkarten, Mosaik); bei nicht-clean Slots kommen Poster zuerst (neueste Saison). (4) Bestes zuerst: eigene Fotos nach
Größe, Stock in kuratierter Reihenfolge.

Props: `clean`, `photo={false}` (immer Grafik – z. B. Sportstätten-Karten, Instagram-Teaser, Start-Mosaik), `minScale`.
Vereinsfotos stammen von der alten Website bzw. fussball.de (Teamfoto 2024/25); Titel/Datum/Unterschrift in
`data/gallery.js`. Galerie (`lib/gallery.js`) = alle eigenen Fotos + Instagram, ohne Stock; Startseite „Momente“ = 8
neueste (Bereich erst ab 4 Fotos). Fußballseite zeigt das neueste Poster als Mannschaftsfoto. Pexels-Dateien sind in
`.gitignore`, `scripts/prebuild.mjs` lädt sie beim Build. Jedes Bild hat `svh-img`.

**Vorschau-Modus** `SVH_HOTLINK=1 npm run build:local`: Stockfotos vom Pexels-CDN mit `onerror`-Fallback auf die Grafik –
nur für Vorschau-Dateien, nie für die Live-Seite (Datenschutz: keine Drittanfragen).

### 6.3 Wappen, Social, Einbettungen

- Wappen: `src/assets/wappen.png` (Original, transparent, 201×240) → `components/Logo.astro` (WebP 1x/2x/3x, Fallback
  gezeichneter Platzhalter). Abgeleitet: `public/wappen.png` (JSON-LD), `public/favicon.ico`, `favicon-192.png`,
  `apple-touch-icon.png`, `public/og.jpg` (1200×630).
- Instagram: `prebuild.mjs` lädt Behold-JSON (`INSTAGRAM_FEED_URL`) oder Graph API (`INSTAGRAM_TOKEN`), speichert
  Bilder + `feed.json` in `src/assets/instagram/` (gitignored); `lib/instagram.js` + `components/InstagramFeed.astro`.
  Ohne Daten: Teaser (6–8 Stockfoto-Kacheln, `aria-hidden`, + Karte mit Profil-Link). Build bricht nie ab.
- Social: `components/SocialSection.astro` (`#social`, Start + Aktuelles) = InstagramFeed +
  `components/FacebookFeed.astro` (Page-Plugin-iframe der Vereinsseite `socials.facebook`, 2-Klick). Ohne Facebook-URL
  einspaltig.
- Externe Einbettungen generisch: `scripts/embeds.js` – Container `[data-embed="<key>"]` mit `[data-embed-consent]`,
  Button `[data-embed-load]`, Checkbox `[data-embed-remember]` (localStorage `svh-consent-<key>`, aktuell `fussballde`,
  `facebook`), Ziel `[data-embed-slot]` mit `<template>`. `<script>`-Tags werden **sequenziell** neu erzeugt
  (extern → onload → inline). Schlüssel stehen auch in der Datenschutzerklärung.
- fussball.de: `components/FussballDe.astro` (nutzt `embeds.js`). Widget-Code steht als String in
  `fussballde.widgets[].embedHtml` und wird in `<template>` gerendert, erst nach Klick geklont. Ohne Widget-Code:
  Link-Kacheln zu fussball.de. Der Tabellenstand `standing` ist statisch (Stand-Datum anzeigen!).

### 6.4 Animationen

`styles/parts/motion.css` (zuletzt importiert) + `scripts/motion.js` (aus `site.js` importiert).
View Transitions (`@view-transition`), Hero-Einstieg (gestaffelt) + Ken Burns (`.svh-hero__bg img`,
`.svh-pagehero__bg img`), Titel-Schimmer, Scroll-Hinweis, Laufband `.svh-ticker`, Scroll-Fortschritt (`--svh-p` auf
`<html>` → Header-Leiste `.svh-progress` + Ring `.svh-totop__ring`), Button-Lichtkante, Karten-Spotlight (`--mx/--my`),
Zähler `[data-count]`, Countdown `[data-countdown="JJJJ-MM-TTTHH:MM"]`, Wochenplan `[data-weekday]` → `.is-today`,
Parallax `[data-parallax]`.
**Achtung:** auf `.svh-img` nie `animation: none` setzen (würde Ken Burns überschreiben) – Einblenden läuft über
`.js .svh-img:not(.is-loaded)`. Alles respektiert `prefers-reduced-motion`.

### 6.5 Spenden & Formulare

- Spenden: `pages/spenden.astro` – Bankbox (gestapelte Zeilen, Kopier-Knöpfe nur Symbol + „Kopiert“-Blase) und
  `components/GiroCode.astro` (EPC069-12-QR via `qrcode`, Level M; Payload BCD/002/1/SCT/BIC/Name/IBAN/…/Verwendungszweck,
  steht zusätzlich in `data-girocode`).
- Formulare: `components/ContactForm.astro`, `DonationForm.astro`, `scripts/forms.js` (fetch mit
  `Accept: application/json`). Endpunkte: `public/api/contact.php`, `public/api/spende.php`, Helfer `public/api/_lib.php`
  (PHP ≥ 7.4, ohne Abhängigkeiten). Ziel-URLs in `data/forms.js → formActions`.
- Einstellungen: `data/forms.js` (Empfänger, Absender, Anliegen) → `lib/formconfig.js` → `/api/config.json` (beim Build).
  `config.json` und `_lib.php` sind per `.htaccess` gesperrt. Nur öffentliche Vereinsadressen, keine Zugangsdaten.
- Versand: `mail()` des Webspace (Klartext, UTF-8, `Reply-To` = Absender des Formulars, `-f` = Vereinsadresse) –
  kein Postfach-Passwort nötig.
- Antworten: JSON `{ok, error}` (Codes `invalid` 422, `spam` 429, `send_failed` 502) bzw. ohne JS 303-Redirect auf
  `/kontakt/danke/`, `/spenden/danke/`, `/kontakt/fehler/`. GET auf einen Endpunkt → 303 zurück zum Formular.
- Spam: Honeypot `website` (gibt still „ok“ zurück), Zeitsperre `ts` < 3 s. `ts` setzt erst `forms.js` – fehlt es
  (kein JS), wird bewusst **nicht** geblockt. Header-Injection: einzeilige Felder via `svh_line()`, Namen im `Reply-To`
  gequotet bzw. RFC-2047-kodiert. Abgedeckt durch `tests/e2e/formulare.spec.js` (läuft mit PHP in der CI).

### 6.6 Suche, Kalender, Filter, Sponsoren, Weiterleitungen

- Suche: `lib/search.js` baut den Index → `pages/suche.json.js`; Client `scripts/searchcore.js` (Normalisierung ä→a usw.),
  Overlay in `scripts/site.js`, Seite `pages/suche.astro`. `hrefFor()` + `window.SVH_ROOT` nur für die relative
  Vorschau-Version.
- Modal/Kalender: `components/EventModal.astro` (JSON in `#svh-events-data`) + `scripts/modal.js`; der `.ics`-Export
  steckt in `scripts/ics.js` (reine Funktionen, RFC-5545-Maskierung, getestet). `pages/kalender.astro` +
  `scripts/calendar.js` (Monatsansicht inkl. Trainings aus `trainingSlots`).
- Filter-Chips generisch: `[data-filter-group][data-filter-target]` + Items `[data-filter-cat]` (in `scripts/site.js`).
- Sponsoren: Seite `pages/sponsoren.astro` (gleiche URL wie auf der alten Website; früher `/partner/`), Karte
  `components/cards/SponsorCard.astro` (Logo aus `src/assets/sponsors/<id>.(png|jpg|webp)` → WebP, sonst `logo`-Pfad aus
  `public/`, sonst neutrale Schriftkachel). Startseite: Leiste „Danke an unsere Sponsoren“ (`compact`) +
  Einladungskachel. Suche indexiert Sponsoren.
- Weiterleitungen: `data/redirects.js` → **`.htaccess`** mit echten 301 (`RewriteRule ^alt/?$ /neu/ [R=301,L,NE]`, mit
  und ohne Schrägstrich, Anker bleiben erhalten). Zusätzlich erzeugt `pages/[...legacy].astro` statische Seiten mit
  Meta-Refresh + canonical + `noindex` als Rückfall (z. B. für lokale Server); aus der Sitemap gefiltert.

## 7. Design-System

- Präfix **`svh-`**, BEM-artig (`svh-card__title`, `svh-btn--primary`). Tokens in `src/styles/variables.css`
  (Rot `--svh-red #c8102e`, Blau `--svh-blue #1d4fb8`, Ink `#171a20`, `--svh-tricolor` = Vereinsstreifen).
- Reihenfolge der Bausteine: `src/styles/global.css`. Neue Bausteine in `parts/extras.css` ergänzen.
- Breakpoints: Desktop-Navigation ab 1101 px (darunter Burger), Raster 1000/820/560 px, keine horizontale Scrollbar
  (360–1536 px getestet).
- Wappen = Original (siehe 6.3); `img.svh-logo` mit `object-fit: contain` in quadratischen Boxen.
- Einblenden beim Scrollen: `.js .svh-reveal` (+ `--zoom`, `data-delay`) per IntersectionObserver. Nur
  `transform`/`opacity` animieren; `prefers-reduced-motion` wird respektiert.
- Scroll-Hinweis im Hero sitzt rechts unten (ab 1000 px), damit er die linksbündigen Inhalte nie überdeckt.
- Akzentfarben (`--svh-acc-*`) erfüllen 4,5:1 auf Weiß **und** auf ihrer 14-%-Tönung (Plaketten in Terminen) – neue
  Akzente vorher nachrechnen, `barrierefreiheit.spec.js` prüft es.
- Overlays mit `visibility: hidden` (Suche, Termin-Modal, Galerie-Lightbox): im `.is-open`-Zustand `visibility 0s` als Transition, sonst
  kann `focus()` beim Öffnen ins Leere gehen (Element noch unsichtbar). Ausblenden darf verzögert bleiben.

## 8. Qualität & Tooling

| Werkzeug                             | Konfiguration                                 | Hinweise                                                                                                                                               |
| ------------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Prettier 3 + `prettier-plugin-astro` | `.prettierrc.json`, `.prettierignore`         | keine Semikolons, einfache Anführungszeichen, Breite 120                                                                                               |
| ESLint 10 (Flat Config)              | `eslint.config.js`                            | `@eslint/js` recommended, `eslint-plugin-astro` + jsx-a11y, TS-Parser fürs Frontmatter, `eslint-config-prettier`                                       |
| Vitest 5                             | `vitest.config.js`, `tests/*.test.js`         | nur reine Module (kein DOM); Astro-Komponenten prüft der Build                                                                                         |
| Playwright 1.64 + axe-core           | `playwright.config.js`, `tests/e2e/*.spec.js` | Chromium, Desktop 1280 px + Handy 360 px; mit PHP `php -S` + `tests/e2e/php-router.php` (wie `.htaccess`, `mail()` → Datei), sonst `scripts/serve.mjs` |
| Husky 9                              | `.husky/`                                     | `pre-commit` → Commit-Wächter (`scripts/check-staged.mjs`) + lint-staged, `commit-msg` → Wächter + commitlint, `pre-push` → `npm test`                 |
| lint-staged                          | `package.json` → `lint-staged`                | ESLint `--fix` + Prettier nur auf gestagte Dateien                                                                                                     |
| commitlint                           | `commitlint.config.js`                        | Conventional Commits, Groß-/Kleinschreibung des Betreffs frei (Deutsch)                                                                                |
| EditorConfig / VS Code               | `.editorconfig`, `.vscode/`                   | LF, 2 Leerzeichen; `.cmd`/`.ps1` mit CRLF (`.gitattributes`)                                                                                           |
| GitHub Actions                       | `.github/workflows/ci.yml`, `deploy.yml`      | CI: Prettier, ESLint, Unit-Tests (Node 24.22.2 + 22.23.4), `build:local`, PHP-Lint, E2E inkl. Formulare. Deploy siehe Abschnitt 9                      |
| Dependabot                           | `.github/dependabot.yml`                      | npm wöchentlich (Astro-Pakete gruppiert), Actions monatlich                                                                                            |

**Tests** (`tests/`): `format` (Datum/Zeitzone), `searchcore` (Normalisierung, Ranking, Escaping), `ics` (Kalender-
export), `data` (IBAN, Links/Weiterleitungen, Slugs, Spielplan), `webspace` (`config.json` für die Formulare, `.htaccess`).
Neue reine Logik gehört in `src/lib/` bzw. `src/scripts/` als DOM-freies Modul mit Test – DOM-Code (z. B. `modal.js`)
importiert sie nur.

**E2E** (`tests/e2e/`): `seiten` – jede Seite der Sitemap lädt mit Status 200, Titel, `<h1>`, ohne Konsolenfehler, ohne
horizontale Scrollbar, **ohne Anfrage an fremde Server**, mit `lang="de"`, Beschreibung, Canonical auf die www-Adresse,
`og:image`, gültigem JSON-LD und ohne kaputte Bilder; 404-Seite. `barrierefreiheit` – axe-core (WCAG 2.1 AA, Stufen
serious/critical) auf jeder Seite, mit reduzierter Bewegung gemessen. `links` – jeder interne Link und Anker auf jeder
Seite existiert, keine absoluten Links auf die Vereinsdomain. `komponenten` – Galerie-Lightbox (Pfeiltasten, Escape,
Fokus), Filter-Chips, Kalender-Monatsansicht, IBAN kopieren, Tastatur-Suche, Suchseite `?q=`, Skip-Link,
Mobile-Untermenü, „Nach oben“. `interaktion` – Mobile-Menü (Fokus, Escape),
Suche (ß/ss), Termin-Modal + `.ics`-Download, Facebook erst nach Klick, Weiterleitungen alter Adressen. `formulare`
(nur mit PHP, in der CI erzwungen per `SVH_E2E_PHP=1`) – Kontakt/Spende mit und ohne JavaScript, Mail-Inhalt,
Header-Injection, Honeypot, Zeitsperre, Validierung, gesperrte Interna. Neue Seiten deckt die Sitemap automatisch ab.

**Ausgabe vergleichen:** Bei Umbauten an Templates/Formatierung den Build vorher/nachher vergleichen
(`dist/` kopieren, neu bauen, `diff -r`). Der statische Build ist deterministisch.

**Zusätzlich manuell geprüft** (beim Relaunch): alle Seiten bei 360/390/768/1024/1280/1536 px ohne Overflow und
ohne Konsolenfehler; Mobile-Menü inkl. Fokus/Escape, Dropdown, Suche, Modal + ICS, Kalender-Monatsansicht,
Galerie-Lightbox, Filter, Kopieren, Formular-Logik; Motion (Laufband, keine externen Requests beim Laden, Zähler,
`--svh-p`, „Heute“, Countdown, Ken Burns, reduzierte Bewegung); Facebook-iframe erst nach Zustimmung.
Link-Check: keine `href="#"`, alle internen Links/Anker existieren.

## 9. Git-Workflow

- Branch `main` = Live-Stand. Größere Änderungen per Branch + Pull Request (Vorlage mit Checkliste).
- Commit-Nachrichten: `<typ>(<bereich>): <beschreibung>` – Typen `feat`, `fix`, `docs`, `style`, `refactor`, `perf`,
  `test`, `build`, `ci`, `chore`, `revert`. Beispiele: `feat(termine): Sommerfest 2027 eintragen`,
  `fix(kalender): Semikolons im ICS-Export maskieren`.
- Hooks nicht mit `--no-verify` umgehen; Fehler beheben.
- Reine Formatierungs-Commits stehen in `.git-blame-ignore-revs`
  (`git config blame.ignoreRevsFile .git-blame-ignore-revs`).

### Deploy (`.github/workflows/deploy.yml`)

- Läuft **nach erfolgreicher CI auf `main`** (`workflow_run`), **nachts** (kommende Termine, Instagram) und manuell.
  Baut mit `npm run build` (inkl. Stockfotos/Instagram) und spiegelt `dist/` per **SFTP mit Deploy-Schlüssel**
  (`lftp mirror --reverse --delete`; `.well-known/` und `cgi-bin/` bleiben unangetastet).
- Eingeschaltet über die Repository-Variable `DEPLOY_ENABLED = true`. Verbindungsdaten nur als Secrets der Environment
  `production` (nur `main`): `DEPLOY_HOST`, `DEPLOY_PORT`, `DEPLOY_USER`, `DEPLOY_PATH`, `DEPLOY_SSH_KEY`,
  `DEPLOY_KNOWN_HOSTS`, optional `INSTAGRAM_FEED_URL`/`INSTAGRAM_TOKEN`. Einrichten: `bash scripts/deploy-secrets.sh`
  (liest `.env` + Schlüssel, zeigt keine Werte). Der Workflow gibt keine Verbindungsdaten aus (Regel 1).
- `--delete` entfernt auf dem Webspace alles, was nicht in `dist/` liegt – vor dem ersten Deploy Webroot prüfen.
- HTTPS-Zwang + HSTS erst einschalten (`src/data/hosting.js → forceHttps`), wenn das SSL-Zertifikat aktiv ist.
- Hauptadresse `https://www.sportverein-hochhausen.de` (`SITE` in `astro.config.mjs`, wie die alte Vereinsseite); die
  `.htaccess` leitet die Adresse ohne `www` per 301 dorthin (Host-Regel vor der HTTPS-Regel → nur ein Sprung).
- Domain-Umzug: nur A/AAAA (Domain + `www`) beim Domain-Anbieter ändern, MX (E-Mail) bleibt. Formular-Mails gehen per
  `mail()` vom Webspace raus – Zustellung ins Vereinspostfach nach jeder Änderung an Mail/DNS testen.

## 10. Typische Aufgaben

| Aufgabe                                              | Wo                                                                                                     | Danach                                    |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| News, Termin, Trainingszeit, Ansprechperson, Sponsor | `src/data/*.js` (Anleitung: `ANPASSEN.md`)                                                             | `npm test` (Daten-Checks), Build          |
| Foto ergänzen                                        | `src/assets/photos/<thema>[-…].jpg` + Eintrag in `data/gallery.js`                                     | Einverständnis klären; Größen-Regel (6.2) |
| Alte URL umleiten                                    | `data/redirects.js`                                                                                    | Test prüft Ziel + Anker automatisch       |
| Neue Seite                                           | `src/pages/<name>.astro` mit `BaseLayout`; ggf. Navigation in `data/site.js`, Suche in `lib/search.js` | Link-Check, Breakpoints                   |
| Neuer CSS-Baustein                                   | `src/styles/parts/extras.css`, Präfix `svh-`                                                           | 360–1536 px ohne Overflow                 |
| Neue Logik                                           | DOM-freies Modul in `src/lib/` oder `src/scripts/` + Test in `tests/`                                  | `npm run validate`                        |
| Externer Dienst/Einbettung                           | über `scripts/embeds.js` (2-Klick)                                                                     | Datenschutzerklärung ergänzen             |

## 11. Offene Punkte

**Vom Verein zu liefern:** Bestätigung Bankverbindung/Kontoinhaber durch den Kassenwart, fussball.de-Widget-Code,
Instagram-Feed-URL/Token, verantwortliche Person nach § 18 MStV (Impressum), Wappen als Vektordatei
(optional), mehr/aktuelle Fotos, aktuelle News/Termine (alte Seiten „Aktuelles“/„Termine“ waren nicht auslesbar),
Sponsorenliste der alten Seite (WebFetch auf /sponsoren/ scheitert) + Sponsor-Logos, Bestätigung Konradsaal
Pfarrgasse 1, Prüfung der Datenschutzerklärung, Bogenschießen-Trainingszeiten (Stand 2017), Einverständnis der
abgebildeten Personen für die übernommenen Vereinsfotos.

**Technisch:**

- Livegang auf dem Webspace: Deploy-Schlüssel hinterlegen, Secrets setzen, Webroot prüfen, `DEPLOY_ENABLED` setzen,
  Testmail über beide Formulare (kommt sie im Vereinspostfach an?), DNS der Domain umstellen, SSL aktivieren, dann
  `forceHttps: true`.
- `package.json → overrides.minimatch` (^11, Sicherheitsfix) entfernen, sobald ESLint/typescript-eslint selbst minimatch
  11 nutzen.
- `npm run check` (astro check) meldet 28 Typfehler im Bestand (implizite `any`, Index-Zugriffe) – daher nicht in der CI.
- Spamschutz der Formulare ist bewusst einfach (Honeypot + Zeitsperre); bei Bedarf Rate-Limit in PHP ergänzen.
