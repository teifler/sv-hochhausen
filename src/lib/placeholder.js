/* =========================================================
   SVG-Platzhalterbilder (deterministisch, ohne Fremdbilder)
   ---------------------------------------------------------
   Erzeugt für jedes Thema ein stimmiges Motiv als data:-URI.
   Wird verwendet, solange kein echtes Foto vorliegt (oder der
   Foto-Download beim Build deaktiviert ist).
   ========================================================= */

function rng(seed) {
  let t = (seed * 1664525 + 1013904223) >>> 0
  return () => {
    t = (t * 1664525 + 1013904223) >>> 0
    return t / 4294967296
  }
}

const PALETTES = {
  hero: { stops: ['#0d1430', '#1d2f6e', '#a50f26'], accent: '#ffd5da', motif: 'stadium' },
  club: { stops: ['#101a3d', '#1d4fb8', '#c8102e'], accent: '#e3ebff', motif: 'rays' },
  football: { stops: ['#0c3f20', '#12692f', '#1c8a44'], accent: '#e6ffee', motif: 'pitch' },
  pitch: { stops: ['#0c3f20', '#12692f', '#1c8a44'], accent: '#e6ffee', motif: 'pitch' },
  team: { stops: ['#0a3a3a', '#0e5a52', '#12806a'], accent: '#daffee', motif: 'stripes' },
  youth: { stops: ['#7a3b06', '#c25e10', '#f0902a'], accent: '#fff0dc', motif: 'bokeh' },
  archery: { stops: ['#0b3a2a', '#11603f', '#1b8a57'], accent: '#e3ffe9', motif: 'target' },
  darts: { stops: ['#1a0d10', '#4d1420', '#8f1d2c'], accent: '#ffe1e5', motif: 'target' },
  gym: { stops: ['#3b1a63', '#5b2aa0', '#7c3aed'], accent: '#ece0ff', motif: 'arcs' },
  fitness: { stops: ['#0b3f39', '#0e6f5a', '#12a17d'], accent: '#daffe8', motif: 'arcs' },
  nordic: { stops: ['#0b3346', '#0e5a6e', '#138a99'], accent: '#dcfbff', motif: 'hills' },
  hiking: { stops: ['#1d3b22', '#2f6b3a', '#6aa84f'], accent: '#ecffe4', motif: 'hills' },
  landscape: { stops: ['#1d4e63', '#2f7d5a', '#7bb356'], accent: '#eafff0', motif: 'hills' },
  sportheim: { stops: ['#3a230c', '#6b3f14', '#a5641f'], accent: '#ffe9cc', motif: 'house' },
  hall: { stops: ['#20303a', '#33505f', '#4a7286'], accent: '#e2f0f5', motif: 'grid' },
  fest: { stops: ['#4a0a14', '#a5112e', '#d6a400'], accent: '#fff2c4', motif: 'confetti' },
  community: { stops: ['#101a3d', '#3a2160', '#c8102e'], accent: '#ffd9df', motif: 'bokeh' },
  history: { stops: ['#2a2118', '#5c4a33', '#9c8258'], accent: '#f0e6d2', motif: 'monogram' },
  gallery: { stops: ['#2a2f3a', '#465063', '#6a7688'], accent: '#eef2f6', motif: 'rays' },
  neutral: { stops: ['#2a2f3a', '#465063', '#6a7688'], accent: '#eef2f6', motif: 'rays' },
}

const ALIASES = { event: 'fest', gymnastics: 'gym', bogen: 'archery', walking: 'nordic', wandern: 'hiking' }

export function paletteFor(theme) {
  return PALETTES[theme] || PALETTES[ALIASES[theme]] || PALETTES.neutral
}

function f(n) {
  return Math.round(n * 10) / 10
}

function motif(kind, w, h, accent, rand) {
  const min = Math.min(w, h)
  let out = ''
  switch (kind) {
    case 'stadium': {
      out += '<g opacity=".5">'
      for (let i = 0; i < 7; i++) {
        const x = (w / 6) * i + rand() * 40 - 20
        out += `<polygon points="${f(x)},0 ${f(x + 120)},0 ${f(x + 40)},${h} ${f(x - 40)},${h}" fill="${accent}" opacity="${f(0.03 + rand() * 0.04)}"/>`
      }
      out += '</g>'
      out += `<ellipse cx="${w / 2}" cy="${f(h + h * 0.35)}" rx="${f(w * 0.62)}" ry="${f(h * 0.5)}" fill="none" stroke="${accent}" stroke-width="2" opacity=".18"/>`
      out += `<ellipse cx="${w / 2}" cy="${f(h + h * 0.35)}" rx="${f(w * 0.42)}" ry="${f(h * 0.34)}" fill="none" stroke="${accent}" stroke-width="2" opacity=".18"/>`
      break
    }
    case 'rays': {
      const cx = w * (0.2 + rand() * 0.2)
      out += '<g opacity=".4">'
      for (let i = 0; i < 9; i++) {
        const ang = -0.6 + i * 0.22
        const len = Math.max(w, h) * 1.4
        const x1 = cx + Math.cos(ang) * len
        const y1 = h * 0.3 + Math.sin(ang) * len
        const x2 = cx + Math.cos(ang + 0.12) * len
        const y2 = h * 0.3 + Math.sin(ang + 0.12) * len
        out += `<polygon points="${f(cx)},${f(h * 0.3)} ${f(x1)},${f(y1)} ${f(x2)},${f(y2)}" fill="${accent}" opacity=".05"/>`
      }
      out += '</g>'
      break
    }
    case 'pitch': {
      for (let i = 0; i < 8; i++) {
        out += `<rect x="${f((w / 8) * i)}" y="0" width="${f(w / 16)}" height="${h}" fill="#fff" opacity=".03"/>`
      }
      const s = `fill="none" stroke="#fff" stroke-width="3" opacity=".5"`
      out += `<circle cx="${w / 2}" cy="${h / 2}" r="${f(min * 0.16)}" ${s}/>`
      out += `<line x1="${w / 2}" y1="0" x2="${w / 2}" y2="${h}" ${s}/>`
      out += `<circle cx="${w / 2}" cy="${h / 2}" r="4" fill="#fff" opacity=".5"/>`
      out += `<rect x="${f(w * 0.82)}" y="${f(h * 0.28)}" width="${f(w * 0.24)}" height="${f(h * 0.44)}" ${s}/>`
      out += `<rect x="${f(-w * 0.06)}" y="${f(h * 0.28)}" width="${f(w * 0.24)}" height="${f(h * 0.44)}" ${s}/>`
      break
    }
    case 'stripes': {
      for (let i = -2; i < 14; i++) {
        const x = (w / 8) * i
        out += `<polygon points="${f(x)},0 ${f(x + w / 16)},0 ${f(x + w / 16 - w * 0.4)},${h} ${f(x - w * 0.4)},${h}" fill="${accent}" opacity=".06"/>`
      }
      break
    }
    case 'arcs': {
      for (let i = 1; i <= 6; i++) {
        out += `<circle cx="${w / 2}" cy="${f(h * 0.95)}" r="${f(min * 0.16 * i)}" fill="none" stroke="${accent}" stroke-width="${f(3 - 0.2 * i)}" opacity="${f(0.4 - 0.04 * i)}"/>`
      }
      break
    }
    case 'target': {
      const cx = w * (0.62 + rand() * 0.12)
      const cy = h * (0.42 + rand() * 0.1)
      const rings = 6
      for (let i = rings; i >= 1; i--) {
        const r = min * 0.075 * i
        const op = i % 2 ? 0.16 : 0.08
        out += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${accent}" opacity="${op}"/>`
      }
      out += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(min * 0.03)}" fill="#fff" opacity=".55"/>`
      /* Pfeil/Dart */
      const ax = cx - min * 0.02
      const ay = cy - min * 0.02
      out += `<line x1="${f(ax)}" y1="${f(ay)}" x2="${f(ax - min * 0.42)}" y2="${f(ay - min * 0.3)}" stroke="#fff" stroke-width="${f(min * 0.012)}" stroke-linecap="round" opacity=".6"/>`
      out += `<polygon points="${f(ax - min * 0.42)},${f(ay - min * 0.3)} ${f(ax - min * 0.5)},${f(ay - min * 0.29)} ${f(ax - min * 0.46)},${f(ay - min * 0.38)}" fill="#fff" opacity=".5"/>`
      break
    }
    case 'waves': {
      for (let i = 0; i < 6; i++) {
        const y = h * (0.2 + 0.13 * i)
        const a = 18 + 6 * i
        let d = `M0 ${f(y)}`
        for (let x = 0; x < w; x += w / 8) d += ` Q${f(x + w / 16)} ${f(y - a)} ${f(x + w / 8)} ${f(y)}`
        out += `<path d="${d}" fill="none" stroke="${accent}" stroke-width="2.5" opacity=".18"/>`
      }
      break
    }
    case 'bokeh': {
      for (let i = 0; i < 18; i++) {
        out += `<circle cx="${f(rand() * w)}" cy="${f(rand() * h)}" r="${f(20 + rand() * 90)}" fill="${accent}" opacity="${f(0.03 + rand() * 0.06)}"/>`
      }
      break
    }
    case 'confetti': {
      const cols = [accent, '#fff', '#ffd76a']
      for (let i = 0; i < 40; i++) {
        const x = rand() * w
        const y = rand() * h
        out += `<rect x="${f(x)}" y="${f(y)}" width="${f(8 + rand() * 10)}" height="${f(4 + rand() * 6)}" fill="${cols[i % 3]}" opacity="${f(0.25 + rand() * 0.4)}" transform="rotate(${f(rand() * 180)} ${f(x)} ${f(y)})"/>`
      }
      break
    }
    case 'hills': {
      out += `<circle cx="${f(w * 0.8)}" cy="${f(h * 0.26)}" r="${f(min * 0.1)}" fill="${accent}" opacity=".35"/>`
      out += `<path d="M0 ${f(h * 0.7)} C ${f(w * 0.25)} ${f(h * 0.5)} ${f(w * 0.45)} ${f(h * 0.62)} ${f(w * 0.6)} ${f(h * 0.55)} S ${f(w * 0.9)} ${f(h * 0.5)} ${w} ${f(h * 0.6)} V ${h} H 0 Z" fill="#0d3a24" opacity=".35"/>`
      out += `<path d="M0 ${f(h * 0.82)} C ${f(w * 0.3)} ${f(h * 0.7)} ${f(w * 0.55)} ${f(h * 0.85)} ${w} ${f(h * 0.74)} V ${h} H 0 Z" fill="#0d3a24" opacity=".5"/>`
      out += `<path d="M ${f(w * 0.2)} ${h} C ${f(w * 0.4)} ${f(h * 0.8)} ${f(w * 0.5)} ${f(h * 0.9)} ${f(w * 0.85)} ${f(h * 0.7)}" fill="none" stroke="${accent}" stroke-width="${f(h * 0.05)}" opacity=".18"/>`
      break
    }
    case 'house': {
      const bw = min * 0.5
      const bx = w / 2 - bw / 2
      const by = h * 0.45
      out += `<rect x="${f(bx)}" y="${f(by)}" width="${f(bw)}" height="${f(h * 0.35)}" fill="${accent}" opacity=".16"/>`
      out += `<polygon points="${f(bx - 20)},${f(by)} ${f(w / 2)},${f(by - min * 0.22)} ${f(bx + bw + 20)},${f(by)}" fill="${accent}" opacity=".16"/>`
      out += `<rect x="${f(bx + bw * 0.15)}" y="${f(by + h * 0.08)}" width="${f(bw * 0.2)}" height="${f(h * 0.1)}" fill="#fff" opacity=".35"/>`
      out += `<rect x="${f(bx + bw * 0.65)}" y="${f(by + h * 0.08)}" width="${f(bw * 0.2)}" height="${f(h * 0.1)}" fill="#fff" opacity=".35"/>`
      break
    }
    case 'grid': {
      for (let i = 1; i < 10; i++)
        out += `<line x1="${f((w / 10) * i)}" y1="0" x2="${f((w / 10) * i)}" y2="${h}" stroke="${accent}" opacity=".18"/>`
      for (let i = 1; i < 6; i++)
        out += `<line x1="0" y1="${f((h / 6) * i)}" x2="${w}" y2="${f((h / 6) * i)}" stroke="${accent}" opacity=".18"/>`
      out += `<circle cx="${w / 2}" cy="${f(h * 1.1)}" r="${f(min * 0.5)}" fill="none" stroke="${accent}" stroke-width="3" opacity=".25"/>`
      break
    }
    case 'monogram': {
      out += `<text x="50%" y="62%" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800" font-size="${f(h * 0.6)}" fill="${accent}" opacity=".1">SVH</text>`
      break
    }
  }
  return out
}

/**
 * Platzhalterbild als data:-URI
 * @param {string} theme  Thema (football, archery, …)
 * @param {object} [opts] { w, h, seed, label }
 */
export function placeholder(theme = 'neutral', { w = 1200, h = 800, seed = 1, label = '' } = {}) {
  const p = paletteFor(theme)
  const rand = rng(seed + String(theme).length * 13)
  const id = `g${seed}${String(theme)
    .replace(/[^a-z]/gi, '')
    .slice(0, 5)}`
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">`
  svg += `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.stops[0]}"/><stop offset=".55" stop-color="${p.stops[1]}"/><stop offset="1" stop-color="${p.stops[2]}"/></linearGradient>`
  svg += `<radialGradient id="v${id}" cx=".5" cy=".4" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient></defs>`
  svg += `<rect width="${w}" height="${h}" fill="url(#${id})"/>`
  svg += motif(p.motif, w, h, p.accent, rand)
  svg += `<rect width="${w}" height="${h}" fill="url(#v${id})"/>`
  if (label) {
    svg += `<text x="50%" y="94%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(h * 0.035)}" fill="#fff" opacity=".55">${String(label).replace(/[<&>]/g, '')}</text>`
  }
  svg += '</svg>'
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const AVATAR = [
  ['#1d4fb8', '#153a8a'],
  ['#c8102e', '#9a0b22'],
  ['#25303f', '#14161b'],
  ['#0e6f5a', '#12a17d'],
  ['#5b2aa0', '#7c3aed'],
  ['#6b3f14', '#a5641f'],
]

/* Initialen-Avatar (für Personen ohne Foto) */
export function avatar(initials = '?', seed = 1) {
  const [a, b] = AVATAR[(seed - 1 + AVATAR.length) % AVATAR.length]
  const id = `a${seed}`
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">` +
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>` +
    `<rect width="240" height="240" fill="url(#${id})"/>` +
    `<text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="96" fill="#fff" opacity=".92">${String(initials).replace(/[<&>]/g, '')}</text>` +
    `</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
