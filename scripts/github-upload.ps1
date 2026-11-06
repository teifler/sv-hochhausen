# =============================================================
#  SV Hochhausen 1946 - Website auf GitHub hochladen (Windows)
#  Wird von GITHUB-HOCHLADEN.cmd gestartet. Macht alles:
#  Git + GitHub CLI installieren (winget), anmelden, Repository
#  anlegen, hochladen und Vercel im Browser oeffnen.
# =============================================================
$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $PSScriptRoot
Set-Location -Path $root

function Write-Step($t) { Write-Host ''; Write-Host "==> $t" -ForegroundColor Cyan }
function Refresh-Path {
  $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
  foreach ($p in @("$env:ProgramFiles\Git\cmd", "$env:ProgramFiles\GitHub CLI", "${env:LOCALAPPDATA}\Programs\Git\cmd")) {
    if ((Test-Path $p) -and ($env:Path -notlike "*$p*")) { $env:Path += ";$p" }
  }
}
function Has($cmd) { return [bool](Get-Command $cmd -ErrorAction SilentlyContinue) }
function Stop-WithMessage($t) { Write-Host ''; Write-Host $t -ForegroundColor Yellow; exit 1 }

Write-Host ''
Write-Host '  SV Hochhausen 1946 - Upload nach GitHub' -ForegroundColor Red
Write-Host '  ---------------------------------------'

# 0) Laeuft das Skript aus einem entpackten Ordner?
if (-not (Test-Path (Join-Path $root 'package.json'))) {
  Stop-WithMessage 'package.json nicht gefunden. Bitte die ZIP-Datei zuerst ENTPACKEN (Rechtsklick > Alle extrahieren) und das Skript im entpackten Ordner starten.'
}
if ($root -match '\\Temp\\' -and $root -match '\.zip') {
  Stop-WithMessage 'Das Skript laeuft direkt aus der ZIP-Datei. Bitte zuerst entpacken (Rechtsklick > Alle extrahieren).'
}

# 1) Git + GitHub CLI
Write-Step 'Pruefe Git und GitHub CLI'
Refresh-Path
if (-not (Has 'git')) {
  if (Has 'winget') {
    Write-Host 'Installiere Git ...'
    winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
    Refresh-Path
  } else {
    Start-Process 'https://git-scm.com/download/win'
    Stop-WithMessage 'Bitte Git installieren (Browser ist offen) und das Skript danach erneut starten.'
  }
}
if (-not (Has 'gh')) {
  if (Has 'winget') {
    Write-Host 'Installiere GitHub CLI ...'
    winget install --id GitHub.cli -e --source winget --accept-package-agreements --accept-source-agreements
    Refresh-Path
  } else {
    Start-Process 'https://cli.github.com'
    Stop-WithMessage 'Bitte die GitHub CLI installieren (Browser ist offen) und das Skript danach erneut starten.'
  }
}
if (-not (Has 'git') -or -not (Has 'gh')) {
  Stop-WithMessage 'Installation abgeschlossen. Bitte dieses Fenster schliessen und GITHUB-HOCHLADEN.cmd noch einmal starten.'
}
Write-Host ('Git:        ' + (git --version))
Write-Host ('GitHub CLI: ' + ((gh --version) | Select-Object -First 1))

# 2) Anmeldung bei GitHub
Write-Step 'Anmeldung bei GitHub'
gh auth status *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Host 'Gleich oeffnet sich der Browser. Den angezeigten Code dort eingeben und bestaetigen.'
  gh auth login --hostname github.com --git-protocol https --web
  if ($LASTEXITCODE -ne 0) { Stop-WithMessage 'Anmeldung fehlgeschlagen. Bitte erneut versuchen.' }
}
gh auth setup-git *> $null
$user = (gh api user --jq .login).Trim()
Write-Host "Angemeldet als: $user"

# 3) Git-Identitaet
$name = git config --global user.name
if (-not $name) { $name = Read-Host 'Dein Name fuer Git (z. B. Max Mustermann)'; git config --global user.name "$name" }
$mail = git config --global user.email
if (-not $mail) { $mail = Read-Host 'Deine E-Mail-Adresse fuer Git'; git config --global user.email "$mail" }

# 4) Lokales Repository + Commit
Write-Step 'Lokales Repository vorbereiten'
if (-not (Test-Path (Join-Path $root '.git'))) { git init -b main | Out-Null }
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
  $msg = @"
chore: Website SV Hochhausen 1946 aktualisieren

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
"@
  $tmp = [System.IO.Path]::GetTempFileName()
  Set-Content -Path $tmp -Value $msg -Encoding ASCII
  git commit -q -F $tmp
  Remove-Item $tmp -ErrorAction SilentlyContinue
  Write-Host 'Aenderungen gespeichert (Commit).'
} else {
  Write-Host 'Keine neuen Aenderungen.'
}
git branch -M main *> $null

# 5) Repository auf GitHub anlegen und hochladen
Write-Step 'Repository auf GitHub'
$repo = Read-Host 'Name des Repositorys [sv-hochhausen]'
if (-not $repo) { $repo = 'sv-hochhausen' }
gh repo view "$user/$repo" *> $null
if ($LASTEXITCODE -ne 0) {
  $vis = Read-Host 'Sichtbarkeit: (p)rivat oder (o)effentlich? [p]'
  $flag = '--private'
  if ($vis -match '^o') { $flag = '--public' }
  git remote remove origin *> $null
  gh repo create $repo $flag --source . --remote origin --push --description 'Website Sportverein 1946 Hochhausen/Tauber e.V.'
  if ($LASTEXITCODE -ne 0) { Stop-WithMessage 'Anlegen/Hochladen fehlgeschlagen.' }
} else {
  Write-Host "Repository $user/$repo existiert bereits - lade hoch ..."
  git remote remove origin *> $null
  git remote add origin "https://github.com/$user/$repo.git"
  git push -u origin main
  if ($LASTEXITCODE -ne 0) {
    $ans = Read-Host 'Auf GitHub liegen andere Inhalte. Mit dieser Version UEBERSCHREIBEN? (j/N)'
    if ($ans -match '^j') {
      git push -u origin main --force
      if ($LASTEXITCODE -ne 0) { Stop-WithMessage 'Hochladen fehlgeschlagen.' }
    } else {
      Stop-WithMessage 'Abgebrochen - nichts ueberschrieben.'
    }
  }
}

Write-Step 'Fertig!'
Write-Host "Repository: https://github.com/$user/$repo" -ForegroundColor Green
Write-Host ''
Write-Host 'Naechster Schritt: Auf Vercel mit GitHub anmelden, das Repository importieren und auf Deploy klicken.'
Write-Host 'Danach unter Settings > Environment Variables die Werte aus .env.example eintragen (siehe ANPASSEN.md).'
Start-Process 'https://vercel.com/new'
