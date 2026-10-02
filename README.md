# Philipp’s Fußball-Geburtstagsquiz

Ein kleines, mobiles Fußballquiz für Philipps 15. Geburtstag. Es läuft vollständig im Browser und speichert keine Eingaben.

## Inhalte anpassen

Alle Texte und Antworten stehen in [`src/config.ts`](src/config.ts). Vor der Veröffentlichung:

1. Alle sechs mit `PLATZHALTER` gekennzeichneten Hinweise ersetzen.
2. Genau einen Hinweis mit `isMisleading: true` markieren.
3. Den Platzhalter unter `success.message` durch die persönliche Nachricht ersetzen.
4. Bei Bedarf weitere zulässige Schreibweisen unter `answer.aliases` ergänzen.

Der irreführende Hinweis wird in der Oberfläche nicht markiert. Das Feld dient nur zur Prüfung der Konfiguration.

## Lokal starten

Node.js 22 oder neuer wird empfohlen.

```powershell
npm install
npm run dev
```

Vite zeigt anschließend die lokale Adresse an. Tests und Produktions-Build:

```powershell
npm test
npm run build
npm run preview
```

## Kostenlos mit GitHub Pages veröffentlichen

Die App ist für ein Repository namens `birthday-quiz` vorkonfiguriert.

1. Bei [GitHub](https://github.com/) anmelden und ein neues **öffentliches** Repository namens `birthday-quiz` anlegen.
2. Dieses Projekt in das Repository hochladen oder mit Git pushen. Der Standardbranch muss `main` heißen.
3. Im GitHub-Repository **Settings → Pages** öffnen.
4. Unter **Build and deployment → Source** die Option **GitHub Actions** wählen.
5. Den Tab **Actions** öffnen und warten, bis „Test, build and deploy to GitHub Pages“ grün abgeschlossen ist.
6. Das Quiz unter `https://GITHUB-BENUTZERNAME.github.io/birthday-quiz/` öffnen.
7. Mikrofon und Texte auf einem Smartphone testen.

Jeder spätere Push auf `main` testet und veröffentlicht die App automatisch erneut.

Falls der Repository-Name geändert wird, muss `base` in [`vite.config.ts`](vite.config.ts) ebenfalls auf `/<NEUER-NAME>/` geändert werden.

## QR-Code erzeugen

1. Nach erfolgreicher Veröffentlichung `https://GITHUB-BENUTZERNAME.github.io/birthday-quiz/#/qr` öffnen.
2. Die öffentliche Hauptadresse des Quiz in das Feld einfügen.
3. **QR-Code herunterladen** wählen.
4. Den Code vor dem Drucken mit einem zweiten Smartphone scannen.

Der QR-Code wird lokal im Browser erzeugt. Die Werkzeugseite ist im normalen Quiz nicht verlinkt.

## Sprachsteuerung

Die Spracheingabe nutzt die im Browser verfügbare Web Speech API und `de-DE`. Nicht alle Browser unterstützen sie. Bei fehlender Unterstützung oder verweigertem Mikrofonzugriff bleibt die Texteingabe uneingeschränkt verfügbar. Für Mikrofonzugriff wird die HTTPS-Adresse von GitHub Pages verwendet.
