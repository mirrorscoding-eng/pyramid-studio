// @ts-nocheck — SVG string generators ported as-is from the original site (legacy/assets).
import { t } from "./content/defaults";

export const hash = (str) => {
    let h = 2166136261;
    for (let i = 0; i < String(str).length; i++) {
      h ^= String(str).charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };

export const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------------- pyramid geometry (traced from the logo) ---------------- */
const K = 0.5708, CX = 540;
const xl = (y) => 165 + K * (y - 298);
const xr = (y) => 915 - K * (y - 298);
const r = (n) => Math.round(n * 10) / 10;
export const layers = () => {
  const out = [{ left: '165,293 540,172 540,293', right: '549,184 872,287 549,287' }];
  const bands = [[298, 422], [428, 552], [558, 682], [688, 812], [818, 955]];
  bands.forEach(([y1, y2], i) => {
    const left = `${r(xl(y1))},${y1} ${CX},${y1} ${CX},${y2} ${r(xl(y2))},${y2}`;
    let right;
    if (i === bands.length - 1) {
      right = `549,${y1 + 4} ${r(xr(y1 + 4) - 9)},${y1 + 4} 549,923`;
    } else {
      right = `549,${y1 + 4} ${r(xr(y1 + 4) - 9)},${y1 + 4} ${r(xr(y2 - 4) - 9)},${y2 - 4} 549,${y2 - 4}`;
    }
    out.push({ left, right, y1, y2 });
  });
  return out;
};
export const VIEWBOX = '150 160 780 810';

/* plain logo (flat, like the brand mark) */
export const logoSVG = (opts = {}) => {
  const ink = opts.ink || 'currentColor';
  const bg = opts.bg || 'none';
  const L = layers();
  return `<svg viewBox="${VIEWBOX}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="${opts.cls || ''}">
    ${L.map((l) => `<polygon points="${l.left}" fill="${ink}"/><polygon points="${l.right}" fill="${bg}" stroke="${ink}" stroke-width="8" stroke-linejoin="miter"/>`).join('')}
  </svg>`;
};

/* shared defs: hatching, stipple, hand-drawn wobble */
export const artDefs = (id, ink = '#141210') => `
  <defs>
    <pattern id="h1-${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="${ink}" stroke-width="1.3"/></pattern>
    <pattern id="h2-${id}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="${ink}" stroke-width="1.5"/></pattern>
    <pattern id="h3-${id}" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><line x1="0" y1="0" x2="0" y2="4" stroke="${ink}" stroke-width="1.6"/></pattern>
    <pattern id="x-${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><path d="M0 0V6M0 0H6" stroke="${ink}" stroke-width="1"/></pattern>
    <pattern id="d-${id}" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="${ink}"/><circle cx="5.5" cy="5.5" r=".8" fill="${ink}"/></pattern>
    <filter id="rough-${id}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter>
  </defs>`;

/* engraved pyramid — the hero / method illustration */
export const engravedPyramid = (opts = {}) => {
  const id = opts.id || 'ep';
  const L = layers();
  const fills = [`url(#h1-${id})`, `url(#h1-${id})`, `url(#h2-${id})`, `url(#h2-${id})`, `url(#h3-${id})`, `url(#h3-${id})`];
  const interactive = !!opts.interactive;
  return `<svg viewBox="100 120 880 920" xmlns="http://www.w3.org/2000/svg" direction="ltr" style="direction:ltr" class="${opts.cls || ''}" ${interactive ? 'role="group"' : 'aria-hidden="true"'}>
    ${artDefs(id)}
    <ellipse cx="560" cy="1000" rx="230" ry="22" fill="url(#d-${id})" opacity=".8"/>
    <ellipse cx="560" cy="1000" rx="120" ry="10" fill="url(#d-${id})"/>
    <g filter="url(#rough-${id})">
      ${L.map((l, i) => `
        <g class="layer" data-layer="${i}" ${interactive ? `tabindex="0" role="button" aria-label="${i + 1}"` : ''}>
          <polygon class="layer-left" points="${l.left}" fill="#141210"/>
          <polygon class="layer-right" points="${l.right}" fill="${fills[i]}" stroke="#141210" stroke-width="7"/>
          ${interactive ? `<text class="layer-num" x="${i === 0 ? 470 : 500}" y="${i === 0 ? 278 : (l.y1 + l.y2) / 2 + 14}" text-anchor="end">${String(i + 1).padStart(2, '0')}</text>` : ''}
        </g>`).join('')}
    </g>
  </svg>`;
};

/* ---------------- generated work covers (engraved, monochrome) ---------------- */
export const coverSVG = (work, catName = '') => {
  const seed = hash(work.id || 'x');
  const style = Number.isInteger(work.cover) ? work.cover % 6 : seed % 6;
  const id = 'c' + (work.id || 'x').replace(/[^a-z0-9]/gi, '') + style;
  const INK = '#141210', PAPER = '#FFFFFF', PAPER2 = '#F1F1EF', OCHRE = '#C9962F';
  const rnd = (n) => { const x = Math.sin(seed + n * 99.13) * 10000; return x - Math.floor(x); };
  const dark = style === 0 || style === 5;
  const fg = dark ? PAPER : INK;
  let art = '';

  if (style === 0) {
    // ink: layered inverted pyramid outline
    const L = layers();
    art = `<rect width="800" height="600" fill="${INK}"/>
      <g transform="translate(173 64) scale(.42)" filter="url(#rough-${id})">
        ${L.map((l) => `<polygon points="${l.left}" fill="none" stroke="${PAPER}" stroke-width="5"/><polygon points="${l.right}" fill="url(#h1p-${id})" stroke="${PAPER}" stroke-width="5"/>`).join('')}
      </g>
      <circle cx="${600 + rnd(1) * 80}" cy="${110 + rnd(2) * 60}" r="14" fill="${OCHRE}"/>`;
  } else if (style === 1) {
    const cx = 470 + rnd(1) * 120;
    art = `<rect width="800" height="600" fill="${PAPER}"/>
      <g filter="url(#rough-${id})">
        <circle cx="${cx}" cy="270" r="170" fill="url(#h1-${id})" stroke="${INK}" stroke-width="4"/>
        <circle cx="${cx}" cy="270" r="110" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>
        <circle cx="${cx}" cy="270" r="110" fill="url(#d-${id})"/>
        <line x1="40" y1="470" x2="760" y2="470" stroke="${INK}" stroke-width="3" stroke-dasharray="3 7"/>
        <polygon points="160,470 260,300 360,470" fill="${INK}"/>
        <polygon points="260,300 360,470 300,470" fill="url(#h2-${id})"/>
      </g>`;
  } else if (style === 2) {
    art = `<rect width="800" height="600" fill="${PAPER2}"/>
      <rect width="400" height="600" fill="${INK}"/>
      <g filter="url(#rough-${id})">
        <polygon points="140,100 400,100 400,480" fill="${PAPER}"/>
        <polygon points="400,100 660,100 400,480" fill="url(#h2-${id})" stroke="${INK}" stroke-width="5"/>
        <line x1="140" y1="140" x2="660" y2="140" stroke="${PAPER2}" stroke-width="6"/>
        <line x1="140" y1="140" x2="400" y2="140" stroke="${INK}" stroke-width="6"/>
      </g>
      <circle cx="${120 + rnd(3) * 60}" cy="${400 + rnd(4) * 60}" r="10" fill="${OCHRE}"/>`;
  } else if (style === 3) {
    const bars = [0, 1, 2, 3, 4].map((i) => 120 + rnd(i + 5) * 240);
    art = `<rect width="800" height="600" fill="${PAPER}"/>
      <rect x="60" y="60" width="680" height="420" rx="22" fill="url(#d-${id})" opacity=".55"/>
      <g filter="url(#rough-${id})">
        ${bars.map((h, i) => `<rect x="${170 + i * 100}" y="${470 - h}" width="64" height="${h}" fill="${i % 2 ? `url(#h2-${id})` : INK}" stroke="${INK}" stroke-width="4"/>`).join('')}
        <path d="M150 ${470 - bars[0] - 30} ${bars.map((h, i) => `L ${202 + i * 100} ${470 - h - 30}`).join(' ')}" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/>
        <line x1="120" y1="470" x2="680" y2="470" stroke="${INK}" stroke-width="4"/>
      </g>`;
  } else if (style === 4) {
    art = `<rect width="800" height="600" fill="${PAPER2}"/>
      <g filter="url(#rough-${id})">
        ${[280, 222, 166, 110, 56].map((rr, i) => `<path d="M ${400 - rr} 480 A ${rr} ${rr} 0 0 1 ${400 + rr} 480 Z" fill="${i % 2 ? PAPER2 : `url(#h${(i % 3) + 1}-${id})`}" stroke="${INK}" stroke-width="4"/>`).join('')}
        <line x1="40" y1="480" x2="760" y2="480" stroke="${INK}" stroke-width="4"/>
      </g>
      <circle cx="${150 + rnd(6) * 500}" cy="110" r="12" fill="${OCHRE}"/>`;
  } else {
    const letter = (t(work.client, 'ar') || t(work.title, 'ar') || 'هـ').trim().charAt(0);
    art = `<rect width="800" height="600" fill="${INK}"/>
      <g filter="url(#rough-${id})">
        <text x="400" y="420" text-anchor="middle" font-family="'Markazi Text', serif" font-weight="700" font-size="380" fill="url(#h1p-${id})" stroke="${PAPER}" stroke-width="4">${esc(letter)}</text>
      </g>
      <circle cx="${560 + rnd(7) * 100}" cy="${120 + rnd(8) * 40}" r="12" fill="${OCHRE}"/>`;
  }

  return `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" class="cover-svg" role="img" aria-label="${esc(t(work.title, 'ar'))}">
    ${artDefs(id)}
    <defs><pattern id="h1p-${id}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="${PAPER}" stroke-width="1.4"/></pattern></defs>
    ${art}
    <text x="40" y="502" font-family="'IBM Plex Sans Arabic', sans-serif" font-size="17" letter-spacing="3" fill="${fg}" opacity=".75" direction="ltr">PYRAMID STUDIO — ${esc(work.year || '')}</text>
    <text x="760" y="502" text-anchor="end" font-family="'IBM Plex Sans Arabic', sans-serif" font-size="17" letter-spacing="2" fill="${fg}" opacity=".75" direction="ltr">${esc(catName).toUpperCase()}</text>
  </svg>`;
};
export const coverHTML = (work, catName) =>
  work.image ? `<img src="${esc(work.image)}" alt="${esc(t(work.title, 'ar'))}" loading="lazy" decoding="async">` : coverSVG(work, catName);

const P = '#FFFFFF';
const ART = {
  analysis: (id) => `
    <ellipse cx="130" cy="202" rx="95" ry="12" fill="url(#d-${id})"/>
    <g filter="url(#rough-${id})" stroke="#141210" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
      <g transform="rotate(-6 105 115)">
        <rect x="34" y="40" width="130" height="150" fill="${P}"/>
        <rect x="52" y="128" width="16" height="44" fill="#141210"/><rect x="76" y="104" width="16" height="68" fill="url(#h1-${id})"/><rect x="100" y="140" width="16" height="32" fill="#141210"/><rect x="124" y="88" width="16" height="84" fill="url(#h2-${id})"/>
        <path d="M50 64h70M50 78h46" stroke-width="2"/>
      </g>
      <path d="M184 132 L226 176" stroke-width="13"/>
      <circle cx="156" cy="100" r="46" fill="${P}"/>
      <circle cx="156" cy="100" r="36" fill="url(#d-${id})"/>
      <path d="M134 84 a26 26 0 0 1 22 -12" fill="none" stroke-width="3"/>
    </g>`,
  plans: (id) => `
    <ellipse cx="130" cy="204" rx="86" ry="11" fill="url(#d-${id})"/>
    <g filter="url(#rough-${id})" stroke="#141210" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
      <rect x="64" y="34" width="132" height="166" rx="12" fill="url(#h1-${id})"/>
      <rect x="78" y="54" width="104" height="132" rx="4" fill="${P}"/>
      <rect x="104" y="24" width="52" height="22" rx="5" fill="#141210"/>
      <rect x="90" y="72" width="16" height="16" fill="${P}"/><path d="M93 80l4 4 8-10" stroke-width="2.6"/>
      <rect x="90" y="104" width="16" height="16" fill="${P}"/><path d="M93 112l4 4 8-10" stroke-width="2.6"/>
      <rect x="90" y="136" width="16" height="16" fill="url(#h3-${id})"/>
      <path d="M116 80h52M116 112h44M116 144h56M116 166h30" stroke-width="2"/>
      <path d="M206 60 l18 -18 M214 76 l20 -4 M200 46 l2 -18" stroke-width="2"/>
    </g>`,
  reports: (id) => `
    <ellipse cx="130" cy="204" rx="96" ry="11" fill="url(#d-${id})"/>
    <g filter="url(#rough-${id})" stroke="#141210" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
      <rect x="70" y="30" width="140" height="168" fill="${P}" transform="rotate(4 140 114)"/>
      <rect x="50" y="40" width="140" height="160" fill="${P}"/>
      <circle cx="96" cy="88" r="28" fill="url(#h2-${id})"/>
      <path d="M96 88 V60 A28 28 0 0 1 124 88 Z" fill="#141210"/>
      <path d="M136 72h40M136 86h30M136 100h36" stroke-width="2"/>
      <polyline points="64,178 92,150 116,162 142,128 172,138" fill="none" stroke-width="2.6"/>
      <circle cx="92" cy="150" r="4" fill="#141210"/><circle cx="142" cy="128" r="4" fill="#141210"/><circle cx="172" cy="138" r="4" fill="${P}"/>
    </g>`,
  web: (id) => `
    <ellipse cx="130" cy="204" rx="100" ry="11" fill="url(#d-${id})"/>
    <g filter="url(#rough-${id})" stroke="#141210" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
      <rect x="26" y="36" width="208" height="152" rx="12" fill="${P}"/>
      <path d="M26 60 h208 V48 q0 -12 -12 -12 H38 q-12 0 -12 12 Z" fill="url(#h1-${id})"/>
      <circle cx="42" cy="48" r="4" fill="#141210"/><circle cx="56" cy="48" r="4" fill="${P}"/><circle cx="70" cy="48" r="4" fill="${P}"/>
      <rect x="44" y="76" width="96" height="62" fill="url(#h3-${id})"/>
      <path d="M156 82h60M156 96h46M156 110h54" stroke-width="2"/>
      <rect x="156" y="124" width="46" height="16" rx="8" fill="#141210"/>
      <path d="M44 156h90M44 170h60" stroke-width="2"/>
      <path d="M196 146 l0 40 l10 -10 l8 16 l7 -4 l-8 -15 l14 -1 Z" fill="#141210" stroke-width="2"/>
    </g>`,
  content: (id) => `
    <ellipse cx="130" cy="200" rx="95" ry="12" fill="url(#d-${id})"/>
    <g filter="url(#rough-${id})" stroke="#141210" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
      <rect x="40" y="60" width="110" height="130" fill="${P}" transform="rotate(-8 95 125)"/>
      <rect x="70" y="50" width="110" height="135" fill="${P}" transform="rotate(5 125 117)"/>
      <g transform="rotate(5 125 117)" stroke-width="2"><path d="M86 74h70M86 90h78M86 106h60M86 122h74M86 138h40"/><rect x="86" y="150" width="44" height="22" fill="url(#h2-${id})"/></g>
      <path d="M150 168 L222 36 L238 46 L170 176 Z" fill="url(#h1-${id})"/>
      <path d="M150 168 L170 176 L152 196 Z" fill="#141210"/>
      <path d="M222 36 L230 22 L246 32 L238 46" fill="#141210"/>
      <path d="M200 20 l6 -10 M214 14 l10 -4 M190 32 l-10 -4" stroke-width="2"/>
    </g>`,
  photo: (id) => `
    <ellipse cx="130" cy="200" rx="100" ry="12" fill="url(#d-${id})"/>
    <g filter="url(#rough-${id})" stroke="#141210" stroke-width="2.6" stroke-linejoin="round">
      <path d="M40 80 Q40 70 50 70 H90 L102 50 H158 L170 70 H210 Q220 70 220 80 V180 Q220 190 210 190 H50 Q40 190 40 180 Z" fill="url(#h1-${id})"/>
      <rect x="52" y="82" width="34" height="18" rx="3" fill="${P}"/>
      <circle cx="135" cy="132" r="46" fill="${P}"/>
      <circle cx="135" cy="132" r="34" fill="url(#h3-${id})"/>
      <circle cx="135" cy="132" r="20" fill="#141210"/>
      <circle cx="127" cy="124" r="6" fill="${P}" stroke="none"/>
      <rect x="180" y="58" width="22" height="12" fill="#141210"/>
      <path d="M200 40 l10 -10 M212 50 l14 -4 M190 34 l2 -14" stroke-width="2" stroke-linecap="round"/>
    </g>`,
  social: (id) => `
    <ellipse cx="130" cy="204" rx="80" ry="10" fill="url(#d-${id})"/>
    <g filter="url(#rough-${id})" stroke="#141210" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">
      <rect x="82" y="26" width="96" height="170" rx="16" fill="url(#h1-${id})"/>
      <rect x="92" y="42" width="76" height="132" rx="6" fill="${P}"/>
      <path d="M130 128 C 104 110, 108 88, 122 88 C 128 88, 130 94, 130 96 C 130 94, 132 88, 138 88 C 152 88, 156 110, 130 128 Z" fill="#141210"/>
      <path d="M104 150h52M104 162h34" stroke-width="2"/>
      <path d="M184 52 h52 q8 0 8 8 v22 q0 8 -8 8 h-32 l-12 10 v-10 h-8 q-8 0 -8 -8 v-22 q0 -8 8 -8 Z" fill="${P}"/>
      <circle cx="198" cy="71" r="3" fill="#141210"/><circle cx="210" cy="71" r="3" fill="#141210"/><circle cx="222" cy="71" r="3" fill="#141210"/>
      <path d="M40 120 C 30 112, 32 102, 39 102 C 42 102, 43 105, 43 106 C 43 105, 44 102, 47 102 C 54 102, 56 112, 46 120 Z" fill="url(#h2-${id})"/>
      <path d="M58 70 C 50 64, 52 56, 57 56 C 59 56, 60 58, 60 59 C 60 58, 61 56, 63 56 C 68 56, 70 64, 62 70 Z" fill="#141210"/>
    </g>`,
  ads: (id) => `
    <ellipse cx="130" cy="202" rx="96" ry="11" fill="url(#d-${id})"/>
    <g filter="url(#rough-${id})" stroke="#141210" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">
      <path d="M60 96 L170 46 L170 170 L60 130 Z" fill="url(#h1-${id})"/>
      <rect x="38" y="92" width="24" height="42" rx="4" fill="#141210"/>
      <ellipse cx="170" cy="108" rx="14" ry="62" fill="${P}"/>
      <ellipse cx="170" cy="108" rx="7" ry="40" fill="url(#h3-${id})"/>
      <path d="M70 130 L84 182 L104 182 L96 136" fill="${P}"/>
      <path d="M200 80 q14 28 0 56 M218 66 q24 42 0 84 M236 54 q32 54 0 108" fill="none" stroke-width="2.2"/>
    </g>`,
  color: (id) => `
    <ellipse cx="130" cy="200" rx="90" ry="12" fill="url(#d-${id})"/>
    <g filter="url(#rough-${id})" stroke="#141210" stroke-width="2.4" stroke-linejoin="round">
      <g transform="rotate(-34 120 176)"><rect x="98" y="30" width="44" height="150" rx="8" fill="${P}"/><rect x="98" y="30" width="44" height="60" rx="8" fill="url(#d-${id})"/></g>
      <g transform="rotate(-12 120 176)"><rect x="98" y="30" width="44" height="150" rx="8" fill="${P}"/><rect x="98" y="30" width="44" height="60" rx="8" fill="url(#h1-${id})"/></g>
      <g transform="rotate(12 120 176)"><rect x="98" y="30" width="44" height="150" rx="8" fill="${P}"/><rect x="98" y="30" width="44" height="60" rx="8" fill="url(#h3-${id})"/></g>
      <g transform="rotate(34 120 176)"><rect x="98" y="30" width="44" height="150" rx="8" fill="${P}"/><rect x="98" y="30" width="44" height="60" rx="8" fill="#141210"/></g>
      <circle cx="120" cy="164" r="9" fill="#141210"/><circle cx="120" cy="164" r="3" fill="${P}" stroke="none"/>
    </g>`
};

export const ART_KEYS = Object.keys(ART);
/** One engraved illustration. Pass a unique id per page so the SVG patterns do not clash. */
export const art = (key, id) => { const k = ART[key] ? key : "content"; const uid = "a" + k + id; return `<svg viewBox="0 0 260 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${artDefs(uid)}${ART[k](uid)}</svg>`; };
