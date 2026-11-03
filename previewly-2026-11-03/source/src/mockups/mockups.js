/* Northvale mockups: the customer prototype the story shows as live HTML (glass panes, device screens,
   the statement behind frosted glass). Each export returns one HTML string whose root is
   <div class="mk mk-NAME" style="width:Wpx;height:Hpx">, laid out for exactly that size.
   Static markup only: no IDs, no handlers, no images, no external URLs. Styles: mockups.css (all under .mk).
   Northvale is fictional, and so are its merchants, publications and addresses. */

/* ---------- formatting ---------- */
const MINUS = '−';
const num = (v, dp = 2) => Math.abs(v).toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp });
const eur = (v, { sign = false, dp = 2 } = {}) => (v < 0 ? MINUS : sign && v > 0 ? '+' : '') + '€' + num(v, dp);
function money(v, opts) {                     // the cents set smaller, as banking apps do
  const s = eur(v, opts), i = s.lastIndexOf('.');
  return i < 0 ? s : `${s.slice(0, i)}<span class="nv-cents">${s.slice(i)}</span>`;
}
const f1 = (n) => Math.round(n * 10) / 10;

// Catmull-Rom through the points, as cubic Béziers (open or closed)
function curve(pts, closed = false) {
  const n = pts.length;
  const P = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ` +
         `${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return closed ? d + 'Z' : d;
}
// a series of values as points in a w x h box (min..max mapped bottom..top)
function fit(values, w, h, lo, hi, x0 = 0, y0 = 0) {
  const a = lo ?? Math.min(...values), b = hi ?? Math.max(...values);
  return values.map((v, i) => [x0 + (i / (values.length - 1)) * w, y0 + h - ((v - a) / (b - a)) * h]);
}

/* ---------- icons (24 grid, stroked) ---------- */
const I = {
  overview: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8"/>',
  accounts: '<path d="M3.5 9 12 4.5 20.5 9"/><path d="M5.5 11v6.5M10 11v6.5M14 11v6.5M18.5 11v6.5"/><path d="M3.5 20h17"/>',
  payments: '<path d="M4 8.5h15"/><path d="m15.5 5 3.5 3.5-3.5 3.5"/><path d="M20 15.5H5"/><path d="M8.5 12 5 15.5 8.5 19"/>',
  cards: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><path d="M7 14.5h3"/>',
  savings: '<path d="M12 20v-6.5"/><path d="M12 13.5C12 9.6 14.6 7 19.5 7c0 4.3-2.8 6.5-7.5 6.5Z"/><path d="M12 15.5c0-3-2.2-5.2-6.5-5.2 0 3.4 2.4 5.2 6.5 5.2Z"/>',
  insights: '<path d="M5 20v-5M10 20V9.5M15 20v-7.5M20 20V5"/>',
  settings: '<path d="M4 7.5h9M17 7.5h3M4 16.5h3M11 16.5h9"/><circle cx="15" cy="7.5" r="2"/><circle cx="9" cy="16.5" r="2"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
  bell: '<path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5H5z"/><path d="M10 20.5h4"/>',
  chevD: '<path d="m7 10 5 5 5-5"/>',
  chevR: '<path d="m10 7 5 5-5 5"/>',
  chevL: '<path d="m14 7-5 5 5 5"/>',
  updown: '<path d="m8 9.5 4-4 4 4"/><path d="m8 14.5 4 4 4-4"/>',
  arrowR: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  up: '<path d="M7 17 17 7"/><path d="M8.5 7H17v8.5"/>',
  down: '<path d="M17 7 7 17"/><path d="M15.5 17H7V8.5"/>',
  tinyUp: '<path d="M12 18V6"/><path d="m6.5 11.5 5.5-5.5 5.5 5.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  exchange: '<path d="M19.5 12a7.5 7.5 0 0 1-13 5.1"/><path d="M4.5 12a7.5 7.5 0 0 1 13-5.1"/><path d="M17.5 3.5v3.4h-3.4"/><path d="M6.5 20.5v-3.4h3.4"/>',
  check: '<path d="m5 12.5 4.2 4.2L19 7"/>',
  shield: '<path d="M12 3.5 5 6.3v5.2c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6.3z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.8"/>',
  snow: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.6 3.5 5.5 3.5 8.5s-1.1 5.9-3.5 8.5c-2.4-2.6-3.5-5.5-3.5-8.5s1.1-5.9 3.5-8.5Z"/>',
  wave: '<path d="M8 9a4.5 4.5 0 0 1 0 6"/><path d="M11.5 6.5a8 8 0 0 1 0 11"/><path d="M15 4a11.5 11.5 0 0 1 0 16"/>',
  cash: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 10v4M18 10v4"/>',
  menu: '<path d="M4 9h16M4 15h16"/>',
  home: '<path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z"/><path d="M9.5 20.5V14h5v6.5"/>',
  grid: '<circle cx="7" cy="7" r="1.6"/><circle cx="17" cy="7" r="1.6"/><circle cx="7" cy="17" r="1.6"/><circle cx="17" cy="17" r="1.6"/>',
  trendDown: '<path d="m3.5 7.5 6 6 4-4 7 7"/><path d="M20.5 11v5.5H15"/>',
  download: '<path d="M12 4v11"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M5 19.5h14"/>',
  print: '<path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="7.5" rx="1.5"/><path d="M7 14h10v6H7z"/>',
  more: '<circle cx="5.5" cy="12" r=".9"/><circle cx="12" cy="12" r=".9"/><circle cx="18.5" cy="12" r=".9"/>',
  panel: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M9.5 4.5v15"/>',
  rotate: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4v4.5H15"/>',
  play: '<path d="M9 7.2v9.6l7.6-4.8z" fill="currentColor"/>',
  umbrella: '<path d="M3.5 12a8.5 8.5 0 0 1 17 0z"/><path d="M12 12v6a2 2 0 0 1-4 0"/>',
  sun: '<circle cx="12" cy="12" r="3.8"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
  bulb: '<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 0 0-3.4 10.9c.6.5.9 1.2.9 2V16h5v-.1c0-.8.3-1.5.9-2A6 6 0 0 0 12 3Z"/>',
};
// one <path> per icon where the parts are all paths: the same drawing, fewer elements.
// A path's first 'm' is absolute and the pairs after it are relative linetos, so it becomes 'M x y l …'.
function absMove(d) {
  const m = d.match(/^m\s*(-?\d*\.?\d+)[\s,]*(-?\d*\.?\d+)\s*(.*)$/);
  if (!m) return d;
  return `M${m[1]} ${m[2]}` + (/^[-.\d]/.test(m[3]) ? 'l' : '') + m[3];
}
for (const k in I) {
  const ds = [...I[k].matchAll(/<path d="([^"]+)"\/>/g)].map((m) => absMove(m[1]));
  if (ds.length > 1) I[k] = I[k].replace(/<path d="[^"]+"\/>/g, '') + `<path d="${ds.join('')}"/>`;
}
const ic = (name, size = 18, sw = 1.75) =>
  `<svg class="nv-ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[name]}</svg>`;
const STAR = 'M12 3.4l2.6 5.4 5.9.8-4.3 4.2 1 5.9L12 16.9l-5.3 2.8 1-5.9-4.2-4.2 5.9-.8z';
const stars = (s = 15) => `<span class="nv-stars">${`<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR}" fill="currentColor"/></svg>`.repeat(5)}</span>`;

/* ---------- the brand ---------- */
// The mark: an N whose right stem is an arrow pointing north.
const N_PATH = 'M8.6 19.6V8.6l9 11V8.4M14.9 11.1l2.7-2.7 2.7 2.7';
const mark = (s = 28, bg = '#111D37', fg = '#F5EFE4') =>
  `<svg class="nv-mark" width="${s}" height="${s}" viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" rx="8" fill="${bg}"/><path d="${N_PATH}" fill="none" stroke="${fg}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const glyph = (s) =>
  `<svg width="${s}" height="${s}" viewBox="6.5 6.5 15 15" aria-hidden="true"><path d="${N_PATH}" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const logo = (s = 28) => `<div class="nv-logo">${mark(s)}<span>Northvale</span></div>`;

// guilloche-like lines on the card
const CARD_LINES = (() => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const y = -40 + i * 30;
    d += `M-20 ${y}C90 ${y - 40} 200 ${y + 52} 360 ${y - 14}`;
  }
  return d;
})();
const CHIP = '<svg viewBox="0 0 40 30" preserveAspectRatio="none" aria-hidden="true"><path d="M0 10.5h13M0 19.5h13M27 10.5h13M27 19.5h13M13 0v30M27 0v30M13 15h14" fill="none" stroke="rgba(92,70,30,.38)" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>';

// The Northvale card, built at any width with whole-pixel sizes.
function payCard(w, { tone = 'green', mini = false, bare = false, name = 'Maya Ellison', last = '4821', style = '' } = {}) {
  const h = Math.round(w / 1.586);
  const r = Math.max(6, Math.round(w * 0.05));
  const p = Math.max(8, Math.round(w * 0.066));
  const fs = Math.max(12, Math.round(w * 0.04));
  const wm = Math.max(12, Math.round(w * 0.05));
  const cw = Math.round(w * 0.135), chh = Math.round(cw * 0.76);
  const cl = Math.max(12, Math.round(w * 0.064));
  const top = mini
    ? `<div class="nv-pc-wm" style="left:${p}px;top:${p}px">${glyph(12)}</div>`
    : `<div class="nv-pc-wm" style="left:${p}px;top:${p}px;font-size:${wm}px">${glyph(Math.round(wm * 1.05))}Northvale</div>`;
  return `<div class="nv-pc${tone === 'sand' ? ' nv-pc--sand' : ''}" style="width:${w}px;height:${h}px;border-radius:${r}px;${style}">` +
    `<svg class="nv-pc-lines" viewBox="0 0 340 214" preserveAspectRatio="none" aria-hidden="true"><path d="${CARD_LINES}" fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>` +
    (bare ? '' : top) +
    `<div class="nv-pc-cl" style="right:${p}px;top:${p - 2}px">${ic('wave', cl, 1.8)}</div>` +
    (bare ? '' : `<div class="nv-pc-chip" style="left:${p}px;top:${Math.round(h * 0.4)}px;width:${cw}px;height:${chh}px">${CHIP}</div>`) +
    (mini || bare ? '' : `<div class="nv-pc-name" style="left:${p}px;bottom:${p}px;font-size:${fs}px">${name}</div>`) +
    (bare ? '' : `<div class="nv-pc-num" style="right:${p}px;bottom:${mini ? p - 2 : p}px;font-size:${fs}px">${mini ? last : '•••• ' + last}</div>`) +
    `</div>`;
}

/* ---------- data ---------- */
// Balance, weekly from 1 May to 29 Oct 2026, in thousands of euro.
const BALANCE = [34.1, 34.62, 34.18, 35.31, 36.44, 35.96, 37.08, 37.85, 37.2, 36.02, 35.38, 36.25, 37.62,
  38.31, 39.48, 39.06, 40.37, 41.62, 41.05, 42.71, 43.88, 45.10418, 44.56, 45.93, 47.12, 48.2504];
const TOTAL = 48250.4;

const CAT = {                // dot colour, monogram background, monogram ink
  Salary: ['#3565C6', '#DEE6F3', '#10398B'],
  Groceries: ['#6E788B', '#E5E8EC', '#3E485A'],
  Transport: ['#C9A96E', '#F1EADC', '#7A6232'],
  'Eating out': ['#C8775A', '#F6E7DF', '#A0563A'],
  Bills: ['#383B40', '#ECE9E3', '#383B40'],
  Health: ['#1B2B4D', '#E1E5EB', '#1B2B4D'],
};
const TX = [
  ['AR', 'Atelier Rowe Studio', 'Salary', '28 Oct', 4850],
  ['FG', 'Fenwick Grocers', 'Groceries', '28 Oct', -86.4],
  ['LR', 'Linea Rail', 'Transport', '27 Oct', -32],
  ['CC', 'Cobble & Co. Coffee', 'Eating out', '26 Oct', -14.8],
  ['LE', 'Lumen Energy', 'Bills', '25 Oct', -118.25],
  ['HG', 'Harbour Gym', 'Health', '24 Oct', -49],
];
const SPEND = [              // October, by category
  ['Housing', 1650, '#111D37'], ['Groceries', 702.4, '#6E788B'], ['Bills', 486.2, '#3565C6'],
  ['Eating out', 431.06, '#C8775A'], ['Transport', 318, '#C9A96E'], ['Other', 324.7, '#DDD3C1'],
];
const SPEND_TOTAL = SPEND.reduce((s, c) => s + c[1], 0);   // 3,912.36

/* ---------- landing ---------- */
// Topographic rings ("the vale") behind the card.
function topo(w, h, cx, cy, rings = 12) {
  let paths = '';
  for (let i = 0; i < rings; i++) {
    const base = 46 + i * 36, wob = 5 + i * 1.7, pts = [];
    for (let k = 0; k < 30; k++) {
      const t = (k / 30) * Math.PI * 2;
      const r = base + wob * Math.sin(3 * t + i * 0.7) + wob * 0.6 * Math.cos(5 * t - i * 0.45);
      pts.push([cx + r * 1.32 * Math.cos(t), cy + r * 0.86 * Math.sin(t)]);
    }
    paths += `<path d="${curve(pts, true)}"/>`;
  }
  return `<svg class="nv-art-topo" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" stroke="#CDBFA5" stroke-opacity=".55" stroke-width="1" aria-hidden="true">${paths}</svg>`;
}

function balanceWidget(w, spark = true) {
  const sw = w - 44, sh = 40;
  const pts = fit(BALANCE.slice(-14), sw, sh - 4, null, null, 0, 2);
  return `<div class="nv-float nv-bw" style="width:${w}px">` +
    `<div class="nv-bw-top"><span class="nv-lbl">Total balance</span>${ic('eye', 16)}</div>` +
    `<div class="nv-bw-val">${money(TOTAL)}</div>` +
    `<div class="nv-bw-d"><b>${ic('tinyUp', 13, 2.2)}€1,240.18</b>this week</div>` +
    (spark ? `<svg class="nv-bw-spark" width="${sw}" height="${sh}" viewBox="0 0 ${sw} ${sh}" fill="none" aria-hidden="true">` +
      `<path d="${curve(pts)}" stroke="#1B2B4D" stroke-width="2" stroke-linecap="round"/>` +
      `<circle cx="${f1(pts.at(-1)[0] - 1)}" cy="${f1(pts.at(-1)[1])}" r="3.5" fill="#fff" stroke="#1B2B4D" stroke-width="2"/></svg>` : '') +
    `</div>`;
}
const notification = (w) =>
  `<div class="nv-float nv-nt" style="width:${w}px">` +
  `<div class="nv-nt-ic">${ic('down', 18, 2)}</div>` +
  `<div><div class="nv-nt-t">Payment received</div><div class="nv-nt-s">From Atelier Rowe Studio</div></div>` +
  `<div class="nv-nt-r"><div class="nv-nt-amt">+€4,850.00</div><div class="nv-nt-s">Just now</div></div></div>`;
function potChip() {
  const C = 2 * Math.PI * 14;
  return `<div class="nv-float nv-pot">` +
    `<div class="nv-pot-ring"><svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">` +
    `<circle cx="18" cy="18" r="14" stroke="#EFEBE4" stroke-width="4"/>` +
    `<circle cx="18" cy="18" r="14" stroke="#3565C6" stroke-width="4" stroke-linecap="round" stroke-dasharray="${f1(C * 0.84)} ${f1(C)}" transform="rotate(-90 18 18)"/></svg></div>` +
    `<div><div class="nv-pot-t">Rainy day fund</div><div class="nv-pot-s">€8,400 of €10,000</div></div></div>`;
}

// The hero's composed visual: panel with topography, the tilted card, and the floating widgets.
function heroArt({ left, top, w, h, card, cardX, cardY, rot, bw, bwX, bwY, nt, ntX, ntY, pot = null }) {
  const ch = Math.round(card / 1.586);
  return `<div class="nv-art" style="left:${left}px;top:${top}px;width:${w}px;height:${h}px">` +
    `<div class="nv-art-panel">${topo(w, h, Math.round(cardX + card / 2), Math.round(cardY + ch / 2))}</div>` +
    `<div class="nv-art-cardwrap" style="left:${cardX}px;top:${cardY}px;width:${card}px;height:${ch}px;transform:rotate(${rot}deg)">${payCard(card)}</div>` +
    `<div style="position:absolute;left:${bwX}px;top:${bwY}px">${balanceWidget(bw)}</div>` +
    `<div style="position:absolute;left:${ntX}px;top:${ntY}px">${notification(nt)}</div>` +
    (pot ? `<div style="position:absolute;left:${pot[0]}px;top:${pot[1]}px">${potChip()}</div>` : '') +
    `</div>`;
}

const heroCopy = () =>
  `<div class="nv-l-copy">` +
  `<div class="nv-l-pill"><b>New</b>Savings pots now earn 3.10% AER${ic('arrowR', 15)}</div>` +
  `<div class="nv-l-h1"><span>Banking that moves</span><span>at your pace.</span></div>` +
  `<div class="nv-l-sub nv-wrap">Spend, save and send from one calm, clear account. Savings that grow every day, and a card that works wherever you do.</div>` +
  `<div class="nv-l-ctas"><span class="nv-btn nv-btn--pri nv-btn--lg">Open an account</span>` +
  `<span class="nv-btn nv-btn--ghost nv-btn--lg">${ic('play', 18)}See how it works</span></div>` +
  `<div class="nv-l-note"><span>${ic('check', 16, 2.2)}Free to open</span><span>${ic('check', 16, 2.2)}No monthly fees</span><span>${ic('check', 16, 2.2)}Ready in 5 minutes</span></div>` +
  `</div>`;

function trust(tablet = false) {
  if (tablet) {
    return `<div class="nv-l-trust">` +
      `<div class="nv-tr"><b>4.9 ${stars(14)}</b><span>from 38,000 reviews</span></div><div class="nv-tr-sep"></div>` +
      `<div class="nv-tr"><b>1.2M</b><span>customers in 14 countries</span></div><div class="nv-tr-sep"></div>` +
      `<div class="nv-tr"><b>${ic('shield', 20, 1.7)}€100,000</b><span>deposits protected</span></div></div>`;
  }
  return `<div class="nv-l-trust">` +
    `<div class="nv-tr"><b>4.9</b>${stars(15)}<span>from 38,000 reviews</span></div><div class="nv-tr-sep"></div>` +
    `<div class="nv-tr"><b>1.2M</b><span>customers in 14 countries</span></div><div class="nv-tr-sep"></div>` +
    `<div class="nv-tr">${ic('shield', 22, 1.6)}<span>Licensed bank. Deposits protected up to €100,000.</span></div>` +
    `</div>`;
}

const press = () =>
  `<div class="nv-l-press"><span class="nv-press-l">As featured in</span>` +
  `<span class="nv-pw nv-pw--ledger">The Ledger</span>` +
  `<span class="nv-pw nv-pw--meridian">MERIDIAN</span>` +
  `<span class="nv-pw nv-pw--finwire">finwire</span>` +
  `<span class="nv-pw nv-pw--harbour">Harbour Post</span>` +
  `<span class="nv-pw nv-pw--kestrel"><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M1 13.5 9 3l8 10.5H12L9 9.5l-3 4z" fill="currentColor"/></svg>Kestrel</span>` +
  `</div>`;

export function landing() {
  return `<div class="mk mk-landing" style="width:1440px;height:900px">` +
    `<div class="nv-l-nav">${logo(30)}` +
    `<div class="nv-l-links"><span>Personal</span><span>Business</span><span>Savings</span><span>Company${ic('chevD', 16)}</span></div>` +
    `<div class="nv-l-navr"><span>Log in</span><span class="nv-btn nv-btn--pri">Open an account</span></div></div>` +
    heroCopy() +
    heroArt({ left: 776, top: 112, w: 584, h: 568, card: 372, cardX: 150, cardY: 110, rot: -9,
      bw: 280, bwX: -64, bwY: 368, nt: 316, ntX: 232, ntY: -24, pot: [356, 412] }) +
    trust() + press() +
    `</div>`;
}

export function landingTablet() {
  return `<div class="mk mk-landing-tablet" style="width:820px;height:1180px">` +
    `<div class="nv-l-nav">${logo(28)}` +
    `<div class="nv-l-navr"><span>Log in</span><span class="nv-btn nv-btn--pri">Open an account</span><span class="nv-menu">${ic('menu', 18)}</span></div></div>` +
    heroCopy() +
    heroArt({ left: 48, top: 568, w: 724, h: 368, card: 340, cardX: 300, cardY: 66, rot: -9,
      bw: 268, bwX: 28, bwY: 112, nt: 300, ntX: 400, ntY: -22, pot: [490, 300] }) +
    trust(true) + press() +
    `</div>`;
}

/* ---------- dashboard ---------- */
function sidebar(v3) {
  const items = [['overview', 'Overview', 1], ['accounts', 'Accounts'], ['payments', 'Payments', 0, 2], ['cards', 'Cards'],
    ['savings', 'Savings'], ['insights', 'Insights']];
  const nav = items.map(([i, t, on, badge]) =>
    `<div class="nv-nav-i${on ? ' nv-on' : ''}">${ic(i, 18)}<span>${t}</span>${badge ? `<span class="nv-nav-b">${badge}</span>` : ''}</div>`).join('');
  const accts = [['#111D37', 'Everyday', '€12,480.40'], ['#3565C6', 'Savings', '€35,770.00']]
    .map(([c, t, v]) => `<div class="nv-acct"><i style="background:${c}"></i><span>${t}</span><span>${v}</span></div>`).join('');
  return `<div class="nv-side">${logo(28)}` +
    `<div class="nv-nav">${nav}<div class="nv-nav-i">${ic('settings', 18)}<span>Settings</span></div>` +
    `<div class="nv-nav-sep"></div><div class="nv-nav-h">Balances</div>${accts}</div>` +
    (v3 ? `<div class="nv-insight" data-new="3"><div class="nv-insight-ic">${ic('trendDown', 18, 2)}</div>` +
      `<div class="nv-insight-t">You spent <b>12% less</b> on dining this month.</div>` +
      `<div class="nv-insight-a">See insights${ic('arrowR', 14)}</div></div>` : '') +
    `<div class="nv-side-user"><span class="nv-avatar">ME</span><div><div class="nv-su-n">Maya Ellison</div><div class="nv-su-p">Premium plan</div></div>${ic('updown', 16)}</div>` +
    `</div>`;
}

const topbar = () =>
  `<div class="nv-top"><div class="nv-search">${ic('search', 17)}<span>Search transactions, payees, cards</span><span class="nv-kbd">⌘K</span></div>` +
  `<div class="nv-top-r"><span class="nv-top-date">Thursday, 29 October</span><span class="nv-iconbtn">${ic('bell', 18)}<span class="nv-pip"></span></span><span class="nv-avatar">ME</span></div></div>`;

function spark(values, color, w = 96, h = 34) {
  const pts = fit(values, w - 4, h - 6, null, null, 2, 3);
  return `<svg class="nv-kpi-sp" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" aria-hidden="true"><path d="${curve(pts)}" stroke="${color}" stroke-width="2" stroke-linecap="round"/></svg>`;
}
const kpis = () =>
  `<div class="nv-kpis">` +
  `<div class="nv-card"><div class="nv-kpi-top"><span class="nv-kpi-l"><i style="background:#111D37"></i>Total balance</span><span class="nv-delta nv-delta--up">${ic('tinyUp', 12, 2.4)}2.4%</span></div>` +
  `<div class="nv-kpi-v">${money(TOTAL)}</div>${spark(BALANCE.slice(-10), '#1B2B4D')}</div>` +
  `<div class="nv-card"><div class="nv-kpi-top"><span class="nv-kpi-l"><i style="background:#3565C6"></i>Income this month</span><span class="nv-delta nv-delta--up">${ic('tinyUp', 12, 2.4)}8.1%</span></div>` +
  `<div class="nv-kpi-v">${money(6420)}</div>${spark([5.1, 5.6, 5.3, 5.9, 5.7, 6.42], '#3565C6')}</div>` +
  `<div class="nv-card"><div class="nv-kpi-top"><span class="nv-kpi-l"><i style="background:#C8775A"></i>Spending this month</span><span class="nv-delta nv-delta--warn">${ic('tinyUp', 12, 2.4)}4.2%</span></div>` +
  `<div class="nv-kpi-v">${money(SPEND_TOTAL)}</div>${spark([3.4, 3.9, 3.6, 4.1, 3.75, 3.91], '#C8775A')}</div>` +
  `</div>`;

function chartCard(W, v2) {
  const iw = W - 40, H = 188, x0 = 46, x1 = iw - 6, yTop = 6, yBot = 160;
  const pts = BALANCE.map((v, i) => [x0 + (i / (BALANCE.length - 1)) * (x1 - x0), yBot - ((v - 30) / 20) * (yBot - yTop)]);
  const line = curve(pts);
  const area = `${line}L${f1(x1)} ${yBot}L${x0} ${yBot}Z`;
  const grid = [50, 45, 40, 35, 30].map((k, i) => {
    const y = f1(yTop + (i * (yBot - yTop)) / 4);
    return `<path d="M${x0} ${y}H${x1}" stroke="${i === 4 ? '#E3DED4' : '#EFEBE4'}" stroke-width="1"${i === 4 ? '' : ' stroke-dasharray="3 4"'}/>` +
      `<text x="0" y="${f1(y + 4)}">€${k}k</text>`;
  }).join('');
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const mid = [14, 45, 75, 106, 137, 167];
  const xl = months.map((m, i) => `<text x="${f1(x0 + (mid[i] / 181) * (x1 - x0))}" y="${H - 4}" text-anchor="middle">${m}</text>`).join('');
  const hp = pts[21];
  const right = v2
    ? `<div class="nv-seg" data-new="2"><span>1M</span><span class="nv-on">6M</span><span>1Y</span></div>`
    : `<div class="nv-select">Last 6 months${ic('chevD', 16)}</div>`;
  return `<div class="nv-card nv-chart" style="width:${W}px">` +
    `<div class="nv-chart-head"><div><div class="nv-lbl">Balance</div><div class="nv-chart-v"><span>${money(TOTAL)}</span>` +
    `<span class="nv-delta nv-delta--up">${ic('tinyUp', 12, 2.4)}${W < 600 ? '41.5%' : '€14,150.40 since May'}</span></div></div>${right}</div>` +
    `<div class="nv-plot" style="width:${iw}px;height:${H}px">` +
    `<div class="nv-area" style="width:${iw}px;height:${yBot}px;clip-path:path('${area}')"></div>` +
    `<svg width="${iw}" height="${H}" viewBox="0 0 ${iw} ${H}" fill="none" style="position:relative" aria-hidden="true">${grid}${xl}` +
    `<path d="M${f1(hp[0])} ${f1(hp[1] + 8)}V${yBot}" stroke="#1B2B4D" stroke-opacity=".35" stroke-width="1" stroke-dasharray="2 3"/>` +
    `<path d="${line}" stroke="#111D37" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<circle cx="${f1(hp[0])}" cy="${f1(hp[1])}" r="9" fill="#111D37" fill-opacity=".10"/>` +
    `<circle cx="${f1(hp[0])}" cy="${f1(hp[1])}" r="4.5" fill="#fff" stroke="#111D37" stroke-width="2.25"/></svg>` +
    `<div class="nv-tip" style="left:${Math.round(hp[0])}px;top:${Math.round(hp[1] - 14)}px"><b>€45,104.18</b><span>30 Sep</span></div>` +
    `</div></div>`;
}

function donutCard(left) {
  const R = 54, C = 2 * Math.PI * R, gap = 2.5;
  let at = 0;
  const segs = SPEND.map(([, v, col]) => {
    const len = (v / SPEND_TOTAL) * C;
    const s = `<circle cx="66" cy="66" r="${R}" stroke="${col}" stroke-width="16" stroke-dasharray="${f1(len - gap)} ${f1(C - len + gap)}" stroke-dashoffset="${f1(-at)}"/>`;
    at += len;
    return s;
  }).join('');
  const legend = SPEND.map(([t, v, col]) => `<div><i style="background:${col}"></i>${t}<span>${Math.round((v / SPEND_TOTAL) * 100)}%</span></div>`).join('');
  return `<div class="nv-card nv-donut" data-new="3" style="left:${left}px">` +
    `<div class="nv-ch"><span class="nv-ch-t">Spending by category</span></div>` +
    `<div class="nv-donut-r"><svg width="132" height="132" viewBox="0 0 132 132" fill="none" style="transform:rotate(-90deg)" aria-hidden="true">${segs}</svg>` +
    `<div class="nv-donut-c"><b>€3,912</b><span>in October</span></div></div>` +
    `<div class="nv-legend">${legend}</div></div>`;
}

function cardsWidget(tall) {
  const head = `<div class="nv-ch"><span class="nv-ch-t">Cards</span><span class="nv-ch-a">Manage${ic('chevR', 14)}</span></div>` +
    `<div class="nv-cw-stack">${payCard(244, { tone: 'sand', bare: true, style: 'left:84px;top:14px' })}${payCard(286, { style: 'left:0;top:0' })}</div>` +
    `<div class="nv-cw-meta"><span class="nv-cw-name">Everyday card<span>•••• 4821</span></span><span class="nv-chip-ok">Active</span></div>`;
  if (!tall) return `<div class="nv-card nv-cw" style="height:296px">${head}</div>`;
  const ctl = [['globe', 'Online payments', 1], ['wave', 'Contactless', 1], ['cash', 'Cash withdrawals', 0]]
    .map(([i, t, on]) => `<div class="nv-ctl"><span class="nv-ctl-ic">${ic(i, 16)}</span>${t}<span class="nv-tog${on ? ' nv-on' : ''}"></span></div>`).join('');
  return `<div class="nv-card nv-cw" style="height:588px">${head}` +
    `<div class="nv-cw-acts"><span>${ic('eye', 16)}Details</span><span>${ic('snow', 16)}Freeze</span><span>${ic('settings', 16)}Limits</span></div>` +
    `<div class="nv-cw-lim"><div class="nv-cw-lim-t"><span>Monthly spending</span><span><b>€1,284.20</b> of €3,000</span></div>` +
    `<div class="nv-bar"><i style="width:43%;background:#111D37"></i></div></div>` +
    `<div class="nv-cw-ctl">${ctl}</div></div>`;
}

function txCard(mono) {
  const rows = TX.map(([m, n, c, d, a]) => {
    const [dot, bg, ink] = CAT[c];
    return `<div class="nv-tx-row">` +
      (mono ? `<span class="nv-monogram" data-new="3" style="background:${bg};color:${ink}">${m}</span>` : '') +
      `<span class="nv-tx-n">${n}</span><span class="nv-tx-c"><i style="background:${dot}"></i>${c}</span>` +
      `<span class="nv-tx-d">${d}</span><span class="nv-tx-a${a > 0 ? ' nv-pos' : ''}">${eur(a, { sign: true })}</span></div>`;
  }).join('');
  return `<div class="nv-card nv-tx${mono ? ' nv-tx--m' : ''}">` +
    `<div class="nv-ch"><span class="nv-ch-t">Recent transactions</span><span class="nv-ch-a">View all${ic('chevR', 14)}</span></div>` +
    `<div class="nv-tx-list">${rows}</div></div>`;
}

function goalsCard() {
  const goals = [['umbrella', 'Rainy day fund', 8400, 10000, '#111D37', '#E1E5EB'], ['sun', 'Lisbon in spring', 1350, 2400, '#3565C6', '#DEE6F3'],
    ['home', 'Home deposit', 18200, 60000, '#C8775A', '#F6E7DF']];
  const list = goals.map(([i, t, v, of, col, bg]) =>
    `<div class="nv-goal"><span class="nv-goal-ic" style="background:${bg};color:${col}">${ic(i, 18)}</span><div class="nv-goal-b">` +
    `<div class="nv-goal-t"><b>${t}</b><span><em>${eur(v, { dp: 0 })}</em> of ${eur(of, { dp: 0 })}</span></div>` +
    `<div class="nv-bar"><i style="width:${Math.round((v / of) * 100)}%;background:${col}"></i></div></div></div>`).join('');
  return `<div class="nv-card nv-goals" data-new="2">` +
    `<div class="nv-ch"><span class="nv-ch-t">Savings goals</span><span class="nv-ch-a">${ic('plus', 14, 2)}New goal</span></div>` +
    `<div class="nv-goal-list">${list}</div></div>`;
}

const quickActions = () =>
  `<div class="nv-qa" data-new="2">` +
  `<span class="nv-btn nv-btn--pri nv-btn--sm">${ic('up', 16, 2)}Send</span>` +
  `<span class="nv-btn nv-btn--sec nv-btn--sm">${ic('down', 16, 2)}Request</span>` +
  `<span class="nv-btn nv-btn--sec nv-btn--sm">${ic('plus', 16, 2)}Top up</span>` +
  `<span class="nv-btn nv-btn--sec nv-btn--sm">${ic('exchange', 16, 1.9)}Exchange</span></div>`;

// v1 the first release; v2 adds range tabs, quick actions and savings goals (data-new="2");
// v3 adds the spending donut, the insight banner and merchant monograms (data-new="3").
export function dashboard(v = 1) {
  v = Math.min(3, Math.max(1, Math.round(+v) || 1));
  const v2 = v >= 2, v3 = v >= 3;
  return `<div class="mk mk-dashboard" data-version="${v}" style="width:1440px;height:900px">` +
    sidebar(v3) + topbar() +
    `<div class="nv-greet"><div class="nv-greet-h">Good morning, Maya</div><div class="nv-greet-s">Here’s where your money stands today.</div></div>` +
    (v2 ? quickActions() : '') +
    kpis() +
    chartCard(v3 ? 465 : 756, v2) +
    (v3 ? donutCard(749) : '') +
    cardsWidget(!v2) +
    txCard(v3) +
    (v2 ? goalsCard() : '') +
    `</div>`;
}

/* ---------- statement ---------- */
export function statement() {
  const open = 45962.18;
  const rows = [
    ['01 Oct', 'Balance brought forward', 0],
    ['01 Oct', 'Quay Street Lettings, rent', -1650],
    ['02 Oct', 'Fenwick Grocers', -64.2],
    ['02 Oct', 'Linea Rail, monthly pass', -96],
    ['03 Oct', 'Cobble & Co. Coffee', -4.8],
    ['04 Oct', 'Transfer from Jonah Ellison', 120],
    ['05 Oct', 'Lumen Energy, direct debit', -118.25],
    ['06 Oct', 'Harbour Gym', -49],
    ['07 Oct', 'Orchard Market', -38.65],
    ['08 Oct', 'Kite Mobile', -24.99],
    ['09 Oct', 'Fenwick Grocers', -71.35],
    ['10 Oct', 'Halden Studio, invoice 1042', 1450],
    ['11 Oct', 'Saltwater Kitchen', -46.5],
    ['12 Oct', 'To Rainy day fund', -250],
  ];
  let bal = open;
  const body = rows.map(([d, t, a]) => {
    bal += a;
    return `<div class="nv-s-row"><span>${d}</span><span>${t}</span><span>${a < 0 ? num(a) : ''}</span>` +
      `<span class="nv-in">${a > 0 ? num(a) : ''}</span><span>${num(bal)}</span></div>`;
  }).join('');
  const thumb = (n, on) => `<div class="nv-s-th${on ? ' nv-on' : ''}"><div class="nv-s-tp">` +
    (n === 1 ? '<i class="nv-g"></i><i style="width:60%"></i><i style="width:40%"></i><i class="nv-box"></i>' : '') +
    '<i></i><i style="width:86%"></i><i></i><i style="width:78%"></i><i></i><i style="width:90%"></i><i></i><i style="width:70%"></i>' +
    (n === 1 ? '' : '<i></i><i style="width:82%"></i><i></i><i style="width:64%"></i>') +
    `</div>${n}</div>`;
  return `<div class="mk mk-statement" style="width:1440px;height:900px">` +
    `<div class="nv-s-bar"><span class="nv-s-ib">${ic('panel', 18)}</span><span class="nv-s-file"><i>PDF</i>northvale-statement-oct-2026.pdf</span>` +
    `<div class="nv-s-mid"><div class="nv-s-grp"><span class="nv-s-box">1</span><span>/ 3</span></div><span class="nv-s-sep"></span>` +
    `<div class="nv-s-grp"><span class="nv-s-ib">${ic('minus', 16)}</span><span class="nv-s-box">72%</span><span class="nv-s-ib">${ic('plus', 16)}</span></div>` +
    `<span class="nv-s-sep"></span><span class="nv-s-ib">${ic('rotate', 17)}</span></div>` +
    `<div class="nv-s-r"><span class="nv-s-ib">${ic('download', 18)}</span><span class="nv-s-ib">${ic('print', 18)}</span><span class="nv-s-ib">${ic('more', 18, 2.6)}</span></div></div>` +
    `<div class="nv-s-thumbs">${thumb(1, true)}${thumb(2)}${thumb(3)}</div>` +
    `<div class="nv-s-page">` +
    `<div class="nv-s-head">${logo(26)}<div class="nv-s-addr">Northvale Bank<br>12 Mill Quay, Dublin 2<br>+353 1 555 0142</div></div>` +
    `<div class="nv-s-rule"></div>` +
    `<div class="nv-s-title"><b>Current account statement</b><span>1–31 October 2026</span></div>` +
    `<div class="nv-s-who"><div><b>Ms Maya Ellison</b><br>18 Alder Row<br>Rathmines<br>Dublin 6, D06 K7P2</div>` +
    `<div class="nv-s-kv"><span>Account</span><span>Everyday current account</span><span>IBAN</span><span class="nv-mono-t">IE29 NVLB 9310 •••• ••48 21</span>` +
    `<span>BIC</span><span class="nv-mono-t">NVLBIE2D</span><span>Statement date</span><span>1 November 2026</span></div></div>` +
    `<div class="nv-s-sum"><div><span>Opening balance</span><b>€${num(open)}</b></div><div><span>Money in</span><b>€6,420.00</b></div>` +
    `<div><span>Money out</span><b>€4,131.78</b></div><div><span>Closing balance</span><b>€${num(TOTAL)}</b></div></div>` +
    `<div class="nv-s-tbl"><div class="nv-s-row nv-s-th2"><span>Date</span><span>Description</span><span>Money out</span><span>Money in</span><span>Balance</span></div>${body}</div>` +
    `<div class="nv-s-cont">Continued on page 2${ic('arrowR', 13)}</div>` +
    `<div class="nv-s-foot"><p>Northvale Bank Ltd is registered in Ireland, no. 704512, at 12 Mill Quay, Dublin 2, and licensed as a credit institution. Eligible deposits are protected up to €100,000.</p><span>Page 1 of 3</span></div>` +
    `</div></div>`;
}

/* ---------- phone dashboard ---------- */
export function dashboardPhone() {
  const lines = (() => { let d = ''; for (let i = 0; i < 8; i++) { const y = -20 + i * 30; d += `M-20 ${y}C110 ${y - 36} 220 ${y + 44} 380 ${y - 12}`; } return d; })();
  const tx = TX.slice(0, 4).map(([m, n, c, d, a]) => {
    const [, bg, ink] = CAT[c];
    return `<div class="nv-p-tx"><span class="nv-monogram" style="background:${bg};color:${ink}">${m}</span>` +
      `<div><div class="nv-p-tx-n">${n}</div><div class="nv-p-tx-c">${c}</div></div>` +
      `<div class="nv-p-tx-r"><div class="nv-p-tx-a${a > 0 ? ' nv-pos' : ''}">${eur(a, { sign: true })}</div><div class="nv-p-tx-c">${d}</div></div></div>`;
  }).join('');
  const tabs = [['home', 'Home', 1], ['payments', 'Payments'], ['cards', 'Cards'], ['savings', 'Savings'], ['grid', 'More']]
    .map(([i, t, on]) => `<div${on ? ' class="nv-on"' : ''}>${ic(i, 24, 1.7)}${t}</div>`).join('');
  return `<div class="mk mk-dashboard-phone" style="width:390px;height:844px">` +
    `<div class="nv-p-head"><span class="nv-avatar">ME</span><div><div class="nv-p-hi">Good morning</div><div class="nv-p-nm">Maya Ellison</div></div>` +
    `<span class="nv-iconbtn">${ic('search', 18)}</span><span class="nv-iconbtn">${ic('bell', 18)}<span class="nv-pip"></span></span></div>` +
    `<div class="nv-p-bal"><svg class="nv-p-lines" width="358" height="200" viewBox="0 0 358 200" fill="none" aria-hidden="true"><path d="${lines}" stroke="#F5EFE4" stroke-width="1"/></svg>` +
    `<div class="nv-p-bal-t"><span>Total balance</span><span class="nv-p-acc"><i></i>All accounts${ic('chevD', 14)}</span></div>` +
    `<div class="nv-p-bal-v">${money(TOTAL)}</div>` +
    `<div class="nv-p-bal-d"><b>${ic('tinyUp', 13, 2.2)}€1,240.18</b>this week</div>` +
    `<div class="nv-p-bal-f"><div><span>Everyday</span><b>€12,480.40</b></div><div><span>Savings</span><b>€35,770.00</b></div></div></div>` +
    `<div class="nv-p-qa"><div><i>${ic('up', 20, 2)}</i>Send</div><div><i>${ic('down', 20, 2)}</i>Request</div>` +
    `<div><i>${ic('plus', 20, 2)}</i>Top up</div><div><i>${ic('exchange', 20, 1.9)}</i>Exchange</div></div>` +
    `<div class="nv-p-card">${payCard(96, { mini: true })}<div class="nv-p-card-b">` +
    `<div class="nv-p-card-t">Everyday card<span class="nv-chip-ok">Active</span></div>` +
    `<div class="nv-p-card-s">€1,284.20 of €3,000 this month</div>` +
    `<div class="nv-bar"><i style="width:43%;background:#111D37"></i></div></div></div>` +
    `<div class="nv-p-sec"><b>Recent activity</b><span>See all</span></div>` +
    `<div class="nv-p-list">${tx}</div>` +
    `<div class="nv-p-tab">${tabs}<span class="nv-p-home"></span></div>` +
    `</div>`;
}

export const MOCKUPS = {
  landing: { fn: landing, w: 1440, h: 900 },
  dashboard: { fn: dashboard, w: 1440, h: 900 },
  statement: { fn: statement, w: 1440, h: 900 },
  landingTablet: { fn: landingTablet, w: 820, h: 1180 },
  dashboardPhone: { fn: dashboardPhone, w: 390, h: 844 },
};
