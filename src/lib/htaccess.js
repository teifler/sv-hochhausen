/* =========================================================
   .htaccess für den Apache-Webspace
   Wird beim Build nach dist/ geschrieben (Integration in astro.config.mjs).
   ========================================================= */

const regexEscape = (s) => s.replace(/[.^$*+?()[\]{}|\\]/g, '\\$&')

/* Nur für Formular-Interna: Direktaufruf sperren (Apache 2.4 und 2.2) */
const DENY = [
  '  <IfModule mod_authz_core.c>',
  '    Require all denied',
  '  </IfModule>',
  '  <IfModule !mod_authz_core.c>',
  '    Order allow,deny',
  '    Deny from all',
  '  </IfModule>',
]

/* canonicalHost: Hauptadresse (z. B. www.beispiel.de) – die Variante mit/ohne www leitet per 301 dorthin */
function hostRules(canonicalHost, forceHttps) {
  if (!canonicalHost) return []
  const bare = canonicalHost.replace(/^www\./, '')
  const other = canonicalHost.startsWith('www.') ? bare : `www.${bare}`
  const scheme = forceHttps ? 'https' : '%{REQUEST_SCHEME}'
  return [
    '',
    `  # Einheitliche Adresse: ${other} → ${canonicalHost}`,
    `  RewriteCond %{HTTP_HOST} ^${regexEscape(other)}$ [NC]`,
    '  RewriteCond %{REQUEST_URI} !^/\\.well-known/',
    `  RewriteRule ^ ${scheme}://${canonicalHost}%{REQUEST_URI} [R=301,L,NE]`,
  ]
}

export function buildHtaccess({ redirects = {}, forceHttps = false, canonicalHost = '' } = {}) {
  const rules = Object.entries(redirects).map(([from, to]) => {
    if (/\s/.test(from) || /\s/.test(to)) throw new Error(`Weiterleitung mit Leerzeichen: ${from} → ${to}`)
    return `  RewriteRule ^${regexEscape(from.replace(/^\/|\/$/g, ''))}/?$ ${to} [R=301,L,NE]`
  })

  return [
    '# =============================================================',
    '#  Erzeugt beim Build aus src/lib/htaccess.js – nicht von Hand ändern.',
    '# =============================================================',
    'Options -Indexes',
    'DirectoryIndex index.html index.php',
    'AddDefaultCharset utf-8',
    'ErrorDocument 404 /404.html',
    '',
    'AddType font/woff2 .woff2',
    'AddType image/webp .webp',
    'AddType image/avif .avif',
    'AddType application/manifest+json .webmanifest',
    '',
    '# Formular-Interna (Helfer + Konfiguration) nicht ausliefern',
    '<FilesMatch "^(_lib\\.php|config\\.json)$">',
    ...DENY,
    '</FilesMatch>',
    '',
    '<IfModule mod_rewrite.c>',
    '  RewriteEngine On',
    '  RewriteBase /',
    ...hostRules(canonicalHost, forceHttps),
    ...(forceHttps
      ? [
          '',
          '  # Immer HTTPS (Zertifikats-Prüfung unter /.well-known/ ausgenommen)',
          '  RewriteCond %{HTTPS} !=on',
          '  RewriteCond %{HTTP:X-Forwarded-Proto} !=https',
          '  RewriteCond %{REQUEST_URI} !^/\\.well-known/',
          '  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L,NE]',
        ]
      : []),
    '',
    '  # Alte Adressen der bisherigen Vereinswebsite (src/data/redirects.js)',
    ...rules,
    '</IfModule>',
    '',
    '<IfModule mod_headers.c>',
    '  Header always set X-Content-Type-Options "nosniff"',
    '  Header always set Referrer-Policy "strict-origin-when-cross-origin"',
    '  Header always set X-Frame-Options "SAMEORIGIN"',
    '  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"',
    ...(forceHttps ? ['  Header always set Strict-Transport-Security "max-age=31536000"'] : []),
    '  <FilesMatch "\\.(html|php|json|xml|txt)$">',
    '    Header set Cache-Control "no-cache"',
    '  </FilesMatch>',
    '</IfModule>',
    '',
    '<IfModule mod_deflate.c>',
    '  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml text/javascript application/javascript application/json application/xml image/svg+xml',
    '</IfModule>',
    '',
  ].join('\n')
}

/* dist/_astro/: Dateinamen enthalten einen Hash → dürfen ein Jahr im Browser-Cache bleiben */
export const ASSETS_HTACCESS = [
  '# Erzeugt beim Build aus src/lib/htaccess.js – Dateien mit Hash im Namen',
  '<IfModule mod_headers.c>',
  '  Header set Cache-Control "public, max-age=31536000, immutable"',
  '</IfModule>',
  '',
].join('\n')
