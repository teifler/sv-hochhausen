/* /api/config.json – Einstellungen für die PHP-Formulare (für Besucher per .htaccess gesperrt) */
import { formConfig } from '../../lib/formconfig.js'

export function GET() {
  return new Response(JSON.stringify(formConfig(), null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}
