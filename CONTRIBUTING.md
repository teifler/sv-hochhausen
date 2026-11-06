# Mitmachen

Danke, dass du an der Website des SV Hochhausen 1946 mitarbeitest!

## Nur Inhalte ändern?

Termine, News, Trainingszeiten, Sponsoren usw. stehen in `src/data/`. Die Anleitung dazu steht in
[`ANPASSEN.md`](ANPASSEN.md). Kleine Änderungen gehen direkt auf GitHub (Datei öffnen → Stift-Symbol). Wer lieber
nichts selbst ändert, legt ein Issue mit der Vorlage **„Inhalt ändern oder ergänzen“** an.

## Am Code arbeiten

```bash
nvm use              # Node-Version aus .nvmrc (24.22.2)
npm install          # installiert auch die Git-Hooks
npm run dev          # http://localhost:4321
```

1. Branch anlegen, z. B. `feat/sommerfest` oder `fix/kalender-export`.
2. Ändern, dann `npm run validate` und `npm run build:local`.
3. Commit nach [Conventional Commits](https://www.conventionalcommits.org/de/v1.0.0/):
   `<typ>(<bereich>): <beschreibung>`, z. B. `feat(termine): Sommerfest 2027 eintragen`.
   Typen: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
4. Pull Request öffnen. Die Checkliste in der Vorlage abhaken, die CI muss grün sein.

Architektur, Regeln und Stolperfallen (Astro 7, Bilder, Datenschutz) stehen in [`AGENTS.md`](AGENTS.md).

## Grundregeln

- **Keine Zugangsdaten – das Repository ist öffentlich.** Passwörter, Loginnamen, Server, Ports, Pfade usw. nie
  committen, auch nicht in Commit-Nachrichten, Issues oder Pull Requests. Dafür gibt es die lokale `.env` und
  GitHub-Secrets.
- **Keine Daten erfinden.** Unbekanntes als Platzhalter markieren.
- **Keine fremden Inhalte**: keine Texte, Bilder oder Logos anderer Vereine oder Websites.
- **Fotos von Personen** nur mit deren Einverständnis.
- **Datenschutz:** keine Anfragen an Drittanbieter beim Seitenaufruf; Einbettungen nur per 2-Klick.
