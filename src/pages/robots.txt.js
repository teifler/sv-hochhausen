/* robots.txt mit korrekter Sitemap-Adresse (SITE_URL) */
export function GET({ site }) {
  const base = site ? site.href.replace(/\/$/, '') : ''
  return new Response(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${base}/sitemap-index.xml\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
