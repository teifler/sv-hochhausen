# SV Hochhausen 1946 – Vereinswebsite

[![CI](https://github.com/teifler/sv-hochhausen/actions/workflows/ci.yml/badge.svg)](https://github.com/teifler/sv-hochhausen/actions/workflows/ci.yml)
![Astro 7](https://img.shields.io/badge/Astro-7.4-BC52EE?logo=astro&logoColor=white)
![Node 24.22 | 22.23.4+](https://img.shields.io/badge/Node-24.22%20%7C%2022.23.4%2B-339933?logo=nodedotjs&logoColor=white)
[![Prettier](https://img.shields.io/badge/code_style-Prettier-F7B93E?logo=prettier&logoColor=white)](https://prettier.io)
[![ESLint](https://img.shields.io/badge/lint-ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org)
[![Vitest](https://img.shields.io/badge/tests-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev)
[![Playwright](https://img.shields.io/badge/e2e-Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev)
[![Conventional Commits](https://img.shields.io/badge/Conventional_Commits-1.0.0-FE5196?logo=conventionalcommits&logoColor=white)](https://www.conventionalcommits.org/de/v1.0.0/)

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

Voraussetzung: Node.js **24.22.2** (steht in `.nvmrc`, mit nvm einfach `nvm use`) oder mindestens 22.23.4 bzw. 24.22.1 –
ältere Versionen haben eine Sicherheitslücke in Brotli (CVE-2026-111497).

## Was drin ist

| Bereich      | Umsetzung                                                                                                                                                                                                                                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Seiten       | Start, Aktuelles (+ Artikel), Verein (Vorstand, Geschichte, Sportstätten), Sport (6 Abteilungen), Fußball, Jugend, Termine & Training, Kalender (Liste/Monat), Vereinsleben, Galerie, Spenden, Mitglied werden, Sponsoren (+ Partner), Kontakt, Suche, Impressum, Datenschutz, 404 – alte Adressen der bisherigen Vereinswebsite leiten automatisch weiter |
| Fußball      | Teamdaten + Tabellenstand aus fussball.de, offizielle Widgets per 2-Klick-Lösung (DSGVO)                                                                                                                                                                                                                                                                   |
| Social Media | Bereich „Folge dem SVH“: Instagram-Beiträge (beim Build geladen, **lokal** ausgeliefert, kein Tracking; ohne Feed ein Bild-Teaser mit Link zu @sv_hochhausen) + Facebook-Timeline der Vereinsseite per 2-Klick                                                                                                                                             |
| Formulare    | Spendenseite mit Vereinskonto, Kopier-Knöpfen und GiroCode (QR für Banking-Apps); Kontakt & Spende → E-Mail per SMTP (jedes Postfach, Mailjet optional), Honeypot + Zeitsperre gegen Spam, funktioniert auch ohne JavaScript                                                                                                                               |
| Bilder       | Echte Vereinsfotos (alte Website + fussball.de) > 7 geprüfte Stockfotos ohne Personen > gezeichnete Grafik; kein Foto doppelt auf einer Seite, kleine Archivfotos nie unscharf groß; Galerie nur mit echten Fotos (+ Instagram); Original-Wappen; automatisch WebP + srcset                                                                                |
| Animationen  | Weiche Seitenwechsel, Hero-Einstieg mit Ken-Burns-Effekt, Sport-Laufband, Scroll-Fortschritt, hochzählende Zahlen, Countdown zum nächsten Spiel, „Heute“ im Wochenplan, Hover-Effekte – alles abschaltbar über „Bewegung reduzieren“ im Betriebssystem                                                                                                     |
| Termine      | Wochenplan aller Trainings, Kalender mit Monatsansicht, `.ics`-Export                                                                                                                                                                                                                                                                                      |
| Suche        | Index wird beim Build erzeugt (`/suche.json`), Overlay mit Tastatursteuerung (`/` oder Strg+K)                                                                                                                                                                                                                                                             |
| Datenschutz  | Schriften und Bilder lokal, keine Cookies, keine Karten-Einbettung, fussball.de und Facebook erst nach Klick                                                                                                                                                                                                                                               |

## Deployment (GitHub + Vercel)

1. **Windows:** Doppelklick auf `GITHUB-HOCHLADEN.cmd` – installiert bei Bedarf Git und GitHub CLI, meldet dich an, legt das Repository an und lädt alles hoch.
2. Auf [vercel.com/new](https://vercel.com/new) das Repository importieren → _Deploy_. Vercel erkennt Astro automatisch.
3. Umgebungsvariablen unter _Project → Settings → Environment Variables_ eintragen (siehe `.env.example`), danach _Redeploy_.

## Inhalte pflegen

Alle Inhalte liegen als einfache JavaScript-Daten in `src/data/` – **Schritt-für-Schritt-Anleitung: [`ANPASSEN.md`](ANPASSEN.md)**.
Technische Doku für Entwickler und KI-Assistenten: [`AGENTS.md`](AGENTS.md).

## Entwicklung

| Befehl                | Zweck                                                    |
| --------------------- | -------------------------------------------------------- |
| `npm run validate`    | alles, was die CI prüft: Prettier, ESLint, Unit-Tests    |
| `npm run format`      | Code mit Prettier formatieren                            |
| `npm run lint:fix`    | ESLint (JavaScript, Astro, Barrierefreiheit) mit Fixes   |
| `npm test`            | Unit-Tests mit Vitest (`test:watch`, `test:coverage`)    |
| `npm run test:e2e`    | E2E-Tests mit Playwright gegen den Build (`test:e2e:ui`) |
| `npm run build:local` | Build ohne Downloads – muss fehlerfrei durchlaufen       |

- **Git-Hooks (Husky):** Vor jedem Commit formatiert und lintet `lint-staged` die geänderten Dateien, commitlint prüft die
  Nachricht, vor dem Push laufen die Tests. Die Hooks richtet `npm install` automatisch ein.
- **Commit-Nachrichten** nach [Conventional Commits](https://www.conventionalcommits.org/de/v1.0.0/), z. B.
  `feat(termine): Sommerfest 2027 eintragen` oder `fix(kalender): ICS-Export korrigieren`.
- **CI:** GitHub Actions prüft jeden Push und Pull Request (Format, Lint, Tests, Build). Dependabot hält die Pakete aktuell.
- **Editor:** Für VS Code liegen empfohlene Erweiterungen und Einstellungen (Formatieren beim Speichern) in `.vscode/`.

Mitmachen: [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Projektstruktur

```
src/
  data/         Inhalte (Verein, News, Termine, Sport, Vorstand, Spenden, fussball.de …)
  pages/        Seiten (+ api/contact.js, api/spende.js als Serverfunktionen)
  components/   Astro-Komponenten (Header, Karten, Formulare, Widgets …)
  layouts/      BaseLayout (Meta, Header, Footer)
  lib/          Helfer (Bilder, Platzhalter, Datum, Suche, Mail)
  scripts/      Browser-JavaScript (Menü, Suche, Kalender, Galerie, Formulare, Animationen, Einbettungen, ICS)
  styles/       Design-System (CSS-Variablen + Bausteine, parts/motion.css = Animationen)
  assets/       wappen.png, photos/ (Vereinsfotos), instagram/ (wird beim Build erzeugt)
tests/          Unit-Tests (Vitest)
scripts/        prebuild.mjs (Fotos/Instagram laden), github-upload.ps1
public/         favicon, Open-Graph-Bild
.github/        CI, Dependabot, Vorlagen für Issues und Pull Requests
```
