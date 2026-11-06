#!/usr/bin/env bash
# =============================================================
#  Richtet den Deploy auf GitHub ein – ohne Werte anzuzeigen:
#  - Environment „production“ (nur Branch main darf sie nutzen)
#  - Secrets DEPLOY_HOST/PORT/USER/PATH aus der lokalen .env
#  - Secret DEPLOY_SSH_KEY aus dem privaten Deploy-Schlüssel
#  - Secret DEPLOY_KNOWN_HOSTS (Host-Schlüssel des Servers)
#
#  Aufruf:  bash scripts/deploy-secrets.sh [Pfad zum privaten Schlüssel]
#  Danach:  gh variable set DEPLOY_ENABLED --body true
#  Voraussetzung: gh ist angemeldet, .env ist ausgefüllt (Vorlage: .env.example).
# =============================================================
set -euo pipefail
cd "$(dirname "$0")/.."

KEY="${1:-$HOME/.ssh/sv-hochhausen-deploy}"
REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"

[ -f .env ] || { echo "✗ .env fehlt (Vorlage: .env.example)"; exit 1; }
[ -f "$KEY" ] || { echo "✗ Privater Schlüssel nicht gefunden: $KEY"; exit 1; }
get() { grep -E "^$1=" .env | tail -1 | cut -d= -f2- | tr -d '\r' || true; }
for k in DEPLOY_HOST DEPLOY_USER DEPLOY_PATH; do
  [ -n "$(get "$k")" ] || { echo "✗ $k ist in .env leer"; exit 1; }
done

echo "Environment „production“ (nur main) …"
gh api -X PUT "repos/$REPO/environments/production" --input - > /dev/null <<'JSON'
{"deployment_branch_policy": {"protected_branches": false, "custom_branch_policies": true}}
JSON
gh api -X POST "repos/$REPO/environments/production/deployment-branch-policies" \
  -f name=main -f type=branch > /dev/null 2>&1 || true

for k in DEPLOY_HOST DEPLOY_PORT DEPLOY_USER DEPLOY_PATH; do
  v="$(get "$k")"
  [ -n "$v" ] || continue
  printf '%s' "$v" | gh secret set "$k" --env production --repo "$REPO" > /dev/null && echo "✓ $k"
done
gh secret set DEPLOY_SSH_KEY --env production --repo "$REPO" < "$KEY" > /dev/null && echo "✓ DEPLOY_SSH_KEY"

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT
port="$(get DEPLOY_PORT)"
ssh-keyscan -T 10 -p "${port:-22}" "$(get DEPLOY_HOST)" 2> /dev/null > "$tmp" || true
[ -s "$tmp" ] || { echo "✗ Host-Schlüssel nicht abrufbar – Server/Port in .env prüfen"; exit 1; }
gh secret set DEPLOY_KNOWN_HOSTS --env production --repo "$REPO" < "$tmp" > /dev/null && echo "✓ DEPLOY_KNOWN_HOSTS"
echo
echo "Fingerprints des Servers (zum Abgleich, nur lokal angezeigt):"
ssh-keygen -lf "$tmp" | awk '{print "  " $2 " " $NF}'
echo
echo "Fertig. Deploy einschalten, wenn der Webspace geprüft ist:"
echo "  gh variable set DEPLOY_ENABLED --body true --repo $REPO"
