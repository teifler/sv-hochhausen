# Inhalte anpassen – Anleitung für den Verein

Alle Texte und Daten stehen in **`src/data/`**. Datei öffnen (z. B. direkt auf GitHub mit dem Stift-Symbol),
Text ändern, speichern („Commit changes“) – GitHub prüft die Änderung und veröffentlicht die Website danach automatisch
(ca. 3–5 Minuten).

> Tipp: Nur den Text zwischen den Anführungszeichen ändern. Kommas und Klammern stehen lassen.

---

## 1. Nachricht veröffentlichen (`src/data/news.js`)

Einen Block kopieren und oben in die Liste einfügen:

```js
{
  id: 'sommerfest-2027',
  slug: 'sommerfest-2027',          // wird Teil der Adresse: /aktuelles/sommerfest-2027/
  title: 'Sommerfest am Sportplatz',
  category: 'Verein',               // Verein | Fußball | Bogenschießen | Darts | Wandern | Gymnastik | Nordic Walking
  date: '2027-07-10',               // JJJJ-MM-TT
  theme: 'fest',                    // Bildthema (siehe Abschnitt 4)
  seed: 31,                         // andere Zahl = anderes Bild desselben Themas
  excerpt: 'Kurzer Teaser (1–2 Sätze).',
  body: ['Erster Absatz.', 'Zweiter Absatz.'],
  tags: ['fest', 'sportplatz'],
},
```

## 2. Termin eintragen (`src/data/events.js`, Liste `clubEvents`)

```js
{
  id: 'mitgliederversammlung-2027',
  title: 'Mitgliederversammlung',
  date: '2027-03-20',
  time: '19:30',
  location: 'Sportheim Hochhausen',
  locationId: 'sportheim',          // sportplatz | sportheim | konradsaal | friedhof | natur (für „Route“)
  type: 'verein',                   // fussball | bogen | darts | wandern | verein | fest
  description: 'Berichte, Wahlen, Ausblick.',
},
```

Vergangene Termine verschwinden automatisch (täglicher Neubau, siehe 8).
**Fußballspiele** stehen in `src/data/fussballde.js` unter `fixtures` (gleiches Prinzip).

## 3. Trainingszeiten & Ansprechpersonen

- Zeiten: `src/data/sports.js` → `schedule` (`day`: 1 = Montag … 6 = Samstag, 0 = Sonntag).
  `confirm: true` blendet den Hinweis „bitte vorher anfragen“ ein (aktuell beim Bogenschießen, Stand 2017 – bitte prüfen).
- Vorstand & Abteilungsleitungen: `src/data/people.js`.

## 4. Fotos

**Reihenfolge:** echte Vereinsfotos → einige wenige Stockfotos → gezeichnete Grafik in Vereinsfarben.
Jedes Foto erscheint höchstens einmal pro Seite; kleine Archivfotos werden nie unscharf groß gezeigt.

**Echte Fotos (schon drin):** Mannschaftsfotos 2015, 2020/21 und 2024/25, Damengymnastik (3), Bogenschießen,
Nordic Walking und Wandern – von der alten Vereinsseite und von fussball.de. Originale liegen auf dem PC unter
`Claude Arbeitsdateien/SV Hochhausen Website/Vereinsfotos/`. Die **Galerie** zeigt automatisch alle Vereinsfotos
(und, sobald eingerichtet, die Instagram-Beiträge) – ohne Stockfotos.

**Neues Foto einbinden:** JPG in **`src/assets/photos/`** ablegen und nach dem Thema benennen:

| Dateiname                                                           | erscheint bei                                   |
| ------------------------------------------------------------------- | ----------------------------------------------- |
| `football.jpg`, `football-2.jpg` …                                  | Fußball                                         |
| `archery.jpg`                                                       | Bogenschießen                                   |
| `darts.jpg`                                                         | Darts                                           |
| `gym.jpg`                                                           | Damengymnastik                                  |
| `nordic.jpg`                                                        | Nordic Walking                                  |
| `hiking.jpg`                                                        | Wandern                                         |
| `hero.jpg`                                                          | großes Startbild (mind. 1600 px breit)          |
| `sportheim.jpg`, `pitch.jpg`, `hall.jpg`                            | Sportheim, Sportplatz, Konradsaal               |
| `community.jpg`, `fest.jpg`, `club.jpg`, `youth.jpg`, `history.jpg` | Vereinsleben, Feste, Verein, Jugend, Geschichte |

- Mehrere Fotos pro Thema: `-2`, `-3`, … anhängen. Die Website verkleinert und optimiert alles automatisch.
- Fotos mit **eingebrannter Schrift oder Logos** (z. B. Mannschaftsfoto mit Namensliste): `-poster` an den Namen hängen
  (`football-2025-26-poster.jpg`). Solche Bilder kommen nie als Hintergrund unter Text, nur in Karten und in die Galerie.
  Das neueste Poster erscheint automatisch auf der Fußballseite unter „Unsere Mannschaft“.
- Titel, Datum und Bildunterschrift für die Galerie: `src/data/gallery.js` (Schlüssel = Dateiname ohne Endung).
- Je größer, desto besser: ab ca. 1200 px Breite wird ein Foto auch für große Flächen genutzt.
- Bitte nur Fotos verwenden, an denen der Verein die Rechte hat und bei denen die abgebildeten Personen einverstanden sind.

**Stockfotos:** nur noch 7 Stück in `src/lib/pexels.js` (Landschaft, Feldweg, Waldweg, 2× Darts, 2× Bogen-Zielscheiben) –
alle einzeln angesehen: keine erkennbaren Personen, keine Logos. Austauschen: Nummer aus der Pexels-Adresse eintragen
(`pexels.com/de-de/foto/…-12345678/` → `'12345678'`); Liste leeren = nur noch echte Fotos und Grafiken.

## 5. Instagram einbinden (Bilder automatisch laden)

**Variante A – einfach (empfohlen):**

1. Auf [behold.so](https://behold.so) mit dem Instagram-Konto **@sv_hochhausen** anmelden und einen Feed anlegen.
2. Die **JSON-Feed-URL** kopieren (beginnt mit `https://feeds.behold.so/…`).
3. In GitHub → _Settings → Environments → production_ → _Add secret_: Name `INSTAGRAM_FEED_URL`, Wert = diese URL.
   Die Bilder erscheinen beim nächsten Build (spätestens in der Nacht).

**Variante B:** Instagram-API-Token (Business-/Creator-Konto) als `INSTAGRAM_TOKEN` hinterlegen.
Die Bilder werden beim Build heruntergeladen und von der eigenen Website ausgeliefert (datenschutzfreundlich).
Neue Beiträge erscheinen beim nächsten Build – mit dem täglichen Neubau (8) also spätestens am nächsten Tag.
Solange kein Feed hinterlegt ist, zeigt der Bereich „Folge dem SVH“ eine Bildkachel mit Link zum Instagram-Profil.

**Facebook:** Die Vereinsseite ist in `src/data/site.js` unter `socials` eingetragen
(`https://www.facebook.com/Sv1946Hochhausen/`). Sie erscheint im Menü, im Footer, auf der Kontaktseite und im
Bereich „Folge dem SVH“ (Startseite und „Aktuelles“). Dort lässt sich die Facebook-Timeline per Klick laden –
erst dann werden Daten an Meta übertragen (2-Klick-Lösung, siehe Datenschutzerklärung). Ohne Facebook: bei `facebook`
die `url` auf `null` setzen – Buttons und Timeline verschwinden automatisch; den Facebook-Absatz in
`src/pages/datenschutz.astro` dann ebenfalls entfernen.

## 6. fussball.de: Spielplan & Tabelle live

1. Auf [fussball.de](https://www.fussball.de) mit dem Vereinszugang anmelden → **„Widgets“** → neues Widget.
2. Mannschaft **SpG Hochhausen/Tauberb.'heim 3** wählen, Typ „Spielplan“ bzw. „Tabelle“ → Code kopieren.
3. In `src/data/fussballde.js` bei `widgets` den kompletten Code als Text bei `embedHtml` einfügen, z. B.:
   ```js
   { id: 'tabelle', team: 'herren', title: 'Tabelle', embedHtml: `HIER DEN KOPIERTEN CODE EINFÜGEN`, widgetId: null },
   ```
   (Backticks `` ` `` verwenden, dann darf der Code Anführungszeichen enthalten.)
   Die Widgets laden erst nach Klick auf „Inhalte laden“ (Datenschutz). Den Tabellenstand-Kasten (`standing`) gelegentlich
   aktualisieren oder entfernen (`standing: null`).

## 7. Kontakt- & Spendenformular (E-Mail-Versand)

Die Formulare laufen als kleines PHP-Skript auf dem Webspace und verschicken über dessen Mailfunktion – **es müssen
keine Zugangsdaten oder Passwörter eingetragen werden.** Empfänger und Absender stehen in `src/data/forms.js`
(Standard: die Vereinsadresse aus `src/data/site.js`); der Absender muss ein Postfach der Vereinsdomain sein. Dort
stehen auch die Anliegen, die man im Kontaktformular auswählen kann.

## 8. Täglicher Neubau (Termine & Instagram aktuell halten)

Läuft automatisch: Der GitHub-Workflow **Deploy** baut die Website jede Nacht neu und lädt sie hoch – „Kommende
Termine“, das nächste Spiel und Instagram sind so immer aktuell. Sofort neu veröffentlichen: GitHub → _Actions_ →
_Deploy_ → _Run workflow_.

## 9. Spenden: Bankverbindung (`src/data/donate.js`)

Eingetragen ist das Vereinskonto aus dem offiziellen Aufnahmeantrag: **SV Hochhausen, Sparkasse Tauberfranken,
IBAN DE48 6735 2565 0002 0366 22, BIC SOLADES1TBB** (Prüfziffer geprüft). Die Spendenseite zeigt die Daten mit
Kopier-Knöpfen und einem **GiroCode** (QR für Banking-Apps), der beim Build automatisch aus diesen Daten entsteht.
Ändert sich das Konto, nur `donate.js` anpassen. Optional `paypalUrl`. `receipts: true`, wenn der Verein
Spendenquittungen ausstellen kann. **Mitgliedsbeiträge** (30/20/45 € pro Jahr, ebenfalls aus dem Aufnahmeantrag) stehen in
`src/data/membership.js`.

## 10. Sponsoren eintragen (`src/data/partners.js`, Liste `sponsors`)

```js
{
  id: 'e-center-duerr',                      // Kurzname, nur a–z, 0–9, Bindestrich
  name: 'E center Dürr',
  category: 'Lebensmittelmarkt',            // Branche
  place: 'Pestalozziallee 33, 97941 Tauberbischofsheim',
  url: 'https://www.edeka.de/maerkte/024331/',
},
```

**Logo:** Datei mit dem Namen der `id` nach **`src/assets/sponsors/`** legen, z. B. `e-center-duerr.png`
(PNG/JPG/WebP, gern mit transparentem Hintergrund, mind. 200 px hoch). SVG-Logos stattdessen nach
`public/sponsors/` und im Eintrag `logo: '/sponsors/e-center-duerr.svg'` ergänzen. Ohne Logo zeigt die Seite den Namen
als schlichte Schriftkachel. Logos bitte direkt beim Sponsor anfragen (Freigabe!).
Sponsoren erscheinen auf `/sponsoren/` und in der Leiste „Danke an unsere Sponsoren“ auf der Startseite.

## 11. Animationen

Muss nichts eingestellt werden. Wer im Betriebssystem „Bewegung reduzieren“ aktiviert hat, bekommt die Seite automatisch
ohne Animationen. Zahlen, die hochzählen sollen, tragen im HTML `data-count="280"`; der Countdown zum nächsten Spiel
und die „Heute“-Markierung im Wochenplan berechnen sich von selbst.

## 12. Vor dem Livegang prüfen

- **Bankverbindung:** vom Kassenwart bestätigen lassen – vor allem den Kontoinhaber genau so, wie er bei der Sparkasse
  geführt wird (Banken gleichen den Empfängernamen bei Überweisungen ab). Beiträge noch aktuell?
- **Sponsoren:** Liste der bisherigen Sponsoren (alte Seite „Sponsoren“) und die Logos eintragen (Abschnitt 10).
- **Konradsaal:** Adresse „Pfarrgasse 1“ (laut Veranstaltungskalender) kurz bestätigen – `src/data/venues.js`/`site.js`.
- **Fotos:** Die abgebildeten Personen auf den Vereinsfotos (alte Website/fussball.de) kurz fragen, ob sie mit der neuen
  Website einverstanden sind. Neue Fotos (Instagram/WhatsApp) einfach schicken – Abschnitt 4.
- **Impressum:** verantwortliche Person nach § 18 Abs. 2 MStV eintragen (`src/pages/impressum.astro`, Badge „Bitte ergänzen“).
- **Datenschutz:** Mustertext prüfen (lassen), Hinweis-Kasten oben in `src/pages/datenschutz.astro` danach entfernen.
- **Wappen:** Das Original-Wappen ist eingebaut (`src/assets/wappen.png`, 201 × 240 px, von der alten Vereinsseite).
  Falls es eine größere Datei oder eine Vektorversion (SVG/PDF) gibt: einfach ersetzen – Favicon und Vorschaubild
  (`public/favicon*.png`, `public/og.jpg`) baue ich dann neu.
- **Downloads:** Die PDFs liegen noch auf der alten Website. Am besten nach `public/downloads/` kopieren und die Links in
  `src/data/documents.js` auf `/downloads/<datei>.pdf` ändern – sonst funktionieren sie nicht mehr, wenn die alte Seite abgeschaltet wird.
- **Domain & SSL:** DNS der Domain auf den Webspace umstellen, in der Hosting-Verwaltung das kostenlose SSL-Zertifikat
  aktivieren und danach in `src/data/hosting.js` `forceHttps: true` setzen (leitet dann alles auf https:// um).
- **Formulare:** Nach dem ersten Upload beide Formulare (Kontakt, Spende) einmal ausprobieren – kommt die Mail im
  Vereinspostfach an?
