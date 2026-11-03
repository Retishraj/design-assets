// The page's objects, from the isolated Higgsfield renders in assets/renders (GPT Image 2.5, 4K, transparent
// background; job IDs in CLAUDE.md). Each render is trimmed to its object, split where it holds several (the tiles,
// the devices), measured for the anchors the page needs, and encoded:
//   assets/renders/<name>.png  →  public/art/<layer>.avif (10-bit) + .webp, and src/art.json (sizes and anchors)
//   node scripts/assets.mjs                (npm run assets)
// Anchors, all in the layer's own pixels:
//   pouch: the zipper's seam (x at the top and bottom of the teeth), zipTop, zipBottom, the teeth's half width
//   pouch-pull: seat, the slider's middle (the point that rides the seam)
//   bag: mouth (middle of the opening), apex (the V's lowest point, where the page's pull hangs); the render's own pull
//        is filled over (the page draws the pouch's, logo and all); bag-front is the fabric below the zipper's V,
//        bag what is above it (the inside and the back), so the tiles can come out between the two
//   tile-N: centre, cobalt (the one with the blue edge)
//   phone, laptop, tablet: screen, the black display's quad (top left, top right, bottom right, bottom left), and attach,
//        the middle of the top edge (where a stream lands)
import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';

const SRC = 'assets/renders/', WEB = 'public/art/', ART = 'src/art.json';
mkdirSync(WEB, { recursive: true }); mkdirSync('assets/cutouts', { recursive: true });
const art = { note: 'Layers from assets/renders (scripts/assets.mjs). Sizes and anchors in each layer\'s own px.', layers: {}, anchors: {} };

async function load(f) {
  const { data, info } = await sharp(SRC + f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { d: data, W: info.width, H: info.height };
}
const A = (im, x, y) => im.d[(y * im.W + x) * 4 + 3];
function bbox(im, test, x0 = 0, y0 = 0, x1 = im.W - 1, y1 = im.H - 1) {
  let a = Infinity, b = Infinity, c = -1, e = -1;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (test(x, y)) { if (x < a) a = x; if (x > c) c = x; if (y < b) b = y; if (y > e) e = y; }
  return { x: a, y: b, w: c - a + 1, h: e - b + 1 };
}
// connected parts of the mask (4-neighbour), largest first
function parts(im, test) {
  const lab = new Int32Array(im.W * im.H).fill(-1), out = [];
  for (let y = 0; y < im.H; y++) for (let x = 0; x < im.W; x++) {
    const i = y * im.W + x; if (lab[i] >= 0 || !test(x, y)) continue;
    const id = out.length, st = [i], box = { x0: x, y0: y, x1: x, y1: y, n: 0 }; lab[i] = id;
    while (st.length) {
      const j = st.pop(), jx = j % im.W, jy = (j / im.W) | 0; box.n++;
      if (jx < box.x0) box.x0 = jx; if (jx > box.x1) box.x1 = jx; if (jy < box.y0) box.y0 = jy; if (jy > box.y1) box.y1 = jy;
      for (const [nx, ny] of [[jx + 1, jy], [jx - 1, jy], [jx, jy + 1], [jx, jy - 1]]) {
        if (nx < 0 || ny < 0 || nx >= im.W || ny >= im.H) continue;
        const k = ny * im.W + nx; if (lab[k] < 0 && test(nx, ny)) { lab[k] = id; st.push(k); }
      }
    }
    out.push(box);
  }
  out.lab = lab;
  return out.sort((p, q) => q.n - p.n);
}
// writes a layer: the region r of image im (optionally only pixels where keep(x, y)), padded, scaled by k
async function layer(name, im, r, k = 1, keep = null, pad = 6) {
  const x0 = Math.max(0, r.x - pad), y0 = Math.max(0, r.y - pad), x1 = Math.min(im.W, r.x + r.w + pad), y1 = Math.min(im.H, r.y + r.h + pad);
  const w = x1 - x0, h = y1 - y0, buf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const s = ((y0 + y) * im.W + x0 + x) * 4, t = (y * w + x) * 4;
    if (keep && !keep(x0 + x, y0 + y)) continue;
    buf[t] = im.d[s]; buf[t + 1] = im.d[s + 1]; buf[t + 2] = im.d[s + 2]; buf[t + 3] = im.d[s + 3];
  }
  const W2 = Math.round(w * k), H2 = Math.round(h * k);
  const img = () => sharp(buf, { raw: { width: w, height: h, channels: 4 } }).resize(W2, H2, { kernel: 'lanczos3' });
  await img().png({ compressionLevel: 9 }).toFile('assets/cutouts/' + name + '.png');
  await img().avif({ quality: 86, effort: 6, bitdepth: 10 }).toFile(WEB + name + '.avif');
  await img().webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(WEB + name + '.webp');
  // x, y: where the layer sits in its render (scaled like the layer), so parts of one render keep their arrangement
  art.layers[name] = { file: 'art/' + name, w: W2, h: H2, x: Math.round(x0 * k), y: Math.round(y0 * k) };
  console.log(`${name}: ${W2}×${H2}`);
  return { x0, y0, k };   // to map source px into the layer: (x − x0) · k
}
const lum = (im, x, y) => { const i = (y * im.W + x) * 4; return 0.2126 * im.d[i] + 0.7152 * im.d[i + 1] + 0.0722 * im.d[i + 2]; };
const blueish = (im, x, y) => { const i = (y * im.W + x) * 4; return im.d[i + 3] > 128 && im.d[i + 2] > im.d[i] + 60 && im.d[i + 2] > im.d[i + 1] + 30; };
// the pull tab's saturated cobalt (the glow tints the fabric around it, never this deep)
const deepBlue = (im, x, y) => { if (x < 0 || y < 0 || x >= im.W || y >= im.H) return false; const i = (y * im.W + x) * 4; return im.d[i + 3] > 200 && im.d[i + 2] > im.d[i] + 140 && im.d[i + 2] > im.d[i + 1] + 70; };
// the tab's face: the deep blue region reached from a seed (searched downward from it), as a box in source px
function tabBox(im, sx, sy) {
  sx = Math.round(sx); let y = Math.round(sy); while (y < im.H && !deepBlue(im, sx, y)) y++;
  const seen = new Uint8Array(im.W * im.H), st = [y * im.W + sx]; seen[st[0]] = 1;
  const rows = new Map();   // y → [min x, max x] of the region in that row
  while (st.length) {
    const k = st.pop(), x = k % im.W, yy = (k / im.W) | 0, r = rows.get(yy);
    if (!r) rows.set(yy, [x, x]); else { if (x < r[0]) r[0] = x; if (x > r[1]) r[1] = x; }
    for (const [nx, ny] of [[x + 1, yy], [x - 1, yy], [x, yy + 1], [x, yy - 1]]) { const q = ny * im.W + nx; if (deepBlue(im, nx, ny) && !seen[q]) { seen[q] = 1; st.push(q); } }
  }
  // the face from its rows, not its extreme pixels (a few tinted pixels at the edges can join the region): the width
  // most rows reach, the rows at least a third that wide, the median middle
  const rs = [...rows.entries()].sort((p, q) => p[0] - q[0]), ws = rs.map((r) => r[1][1] - r[1][0] + 1).sort((p, q) => p - q);
  const w = ws[Math.floor(ws.length * 0.85)], body = rs.filter((r) => r[1][1] - r[1][0] + 1 > w / 3);
  const mids = body.map((r) => (r[1][0] + r[1][1]) / 2).sort((p, q) => p - q), cx = mids[mids.length >> 1];
  return { x0: cx - (w - 1) / 2, x1: cx + (w - 1) / 2, y0: body[0][0], y1: body[body.length - 1][0] };
}
// a box in source px as the centre and size in a layer's px
const tabIn = (b, m) => ({ x: +(((b.x0 + b.x1) / 2 - m.x0) * m.k).toFixed(1), y: +(((b.y0 + b.y1) / 2 - m.y0) * m.k).toFixed(1), w: +((b.x1 - b.x0 + 1) * m.k).toFixed(1), h: +((b.y1 - b.y0 + 1) * m.k).toFixed(1) });

/* ---- the pouch: trimmed, shrunk to 2250 px tall (it is drawn at most about 1800 px tall), the seam measured ---- */
{
  const im = await load('pouch.png'), r = bbox(im, (x, y) => A(im, x, y) > 8);
  const k = Math.min(1, 2250 / r.h), m = await layer('pouch', im, r, k);
  // the teeth: the darkest run near the middle of each row
  const cx = r.x + r.w / 2, half = r.w * 0.06, rows = [];
  for (let y = r.y; y < r.y + r.h; y++) {
    let a = -1, b = -1;
    for (let x = Math.round(cx - half); x <= cx + half; x++) if (A(im, x, y) > 200 && lum(im, x, y) < 110) { if (a < 0) a = x; b = x; }
    if (a >= 0 && b - a < half) rows.push({ y, a, b });
  }
  const top = rows[0], bot = rows[rows.length - 1], widths = rows.map((q) => q.b - q.a).sort((p, q) => p - q);
  const L = (x, y) => [+((x - m.x0) * k).toFixed(1), +((y - m.y0) * k).toFixed(1)];
  // the seam's x at each end: the median over that end's tenth of the rows (the end stops alone are off-centre)
  const tenth = Math.max(1, Math.round(rows.length / 10));
  const mid = (qs) => { const c = qs.map((q) => (q.a + q.b) / 2).sort((p, q) => p - q); return c[c.length >> 1]; };
  art.anchors.pouch = {
    seamTop: L(mid(rows.slice(0, tenth)), top.y)[0], seamBottom: L(mid(rows.slice(-tenth)), bot.y)[0],
    zipTop: L(0, top.y)[1], zipBottom: L(0, bot.y)[1], teethHalfWidth: +((widths[widths.length >> 1] / 2) * k).toFixed(1)
  };
}
/* ---- the pull: the slider above the blue tab; its seat is the slider's middle; the tab's face carries the logo ---- */
{
  const im = await load('pull.png'), r = bbox(im, (x, y) => A(im, x, y) > 8), m = await layer('pouch-pull', im, r, 0.5);
  let yb = r.y; while (yb < r.y + r.h) { let n = 0; for (let x = r.x; x < r.x + r.w; x++) if (blueish(im, x, yb)) n++; if (n > r.w * 0.25) break; yb++; }
  art.anchors['pouch-pull'] = {
    seat: { x: +((r.x + r.w / 2 - m.x0) * m.k).toFixed(1), y: +((r.y + (yb - r.y) * 0.32 - m.y0) * m.k).toFixed(1) },
    tab: tabIn(tabBox(im, r.x + r.w / 2, yb + (r.y + r.h - yb) / 2), m)
  };
}
/* ---- the tiles: six parts, left to right; the cobalt one has the bluest edge ---- */
{
  const im = await load('tiles.png'), ps = parts(im, (x, y) => A(im, x, y) > 24).slice(0, 6).sort((p, q) => p.x0 - q.x0);
  for (let i = 0; i < ps.length; i++) {
    const p = ps[i], id = ps.lab ? null : null;
    const r = { x: p.x0, y: p.y0, w: p.x1 - p.x0 + 1, h: p.y1 - p.y0 + 1 };
    let blue = 0; for (let y = r.y; y < r.y + r.h; y += 3) for (let x = r.x; x < r.x + r.w; x += 3) if (blueish(im, x, y)) blue++;
    const m = await layer('tile-' + i, im, r, 0.9);
    art.anchors['tile-' + i] = { center: { x: +((r.x + r.w / 2 - m.x0) * m.k).toFixed(1), y: +((r.y + r.h / 2 - m.y0) * m.k).toFixed(1) }, blue };
  }
  const most = Math.max(...ps.map((_, i) => art.anchors['tile-' + i].blue));
  ps.forEach((_, i) => { const a = art.anchors['tile-' + i]; a.cobalt = a.blue === most; delete a.blue; });
}
/* ---- the padlock ---- */
{
  const im = await load('padlock.png'), r = bbox(im, (x, y) => A(im, x, y) > 8);
  await layer('padlock', im, r, Math.min(1, 1400 / r.h));
}
/* ---- the devices: three parts, left to right (phone, laptop, tablet); each screen is its largest black region ---- */
{
  const im = await load('devices.png'), ps = parts(im, (x, y) => A(im, x, y) > 24).slice(0, 3).sort((p, q) => p.x0 - q.x0);
  const names = ['phone', 'laptop', 'tablet'];
  for (let i = 0; i < 3; i++) {
    const p = ps[i], r = { x: p.x0, y: p.y0, w: p.x1 - p.x0 + 1, h: p.y1 - p.y0 + 1 };
    const black = (x, y) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h && A(im, x, y) > 200 && Math.max(im.d[(y * im.W + x) * 4], im.d[(y * im.W + x) * 4 + 1], im.d[(y * im.W + x) * 4 + 2]) <= 5;
    const sub = { d: im.d, W: im.W, H: im.H };
    // the screen: the largest black part inside this device
    let best = null, bn = 0;
    const lab = new Uint8Array(im.W * im.H);
    for (let y = r.y; y < r.y + r.h; y += 2) for (let x = r.x; x < r.x + r.w; x += 2) {
      if (!black(x, y) || lab[y * im.W + x]) continue;
      const st = [[x, y]], pts = []; lab[y * im.W + x] = 1;
      while (st.length) { const [jx, jy] = st.pop(); pts.push([jx, jy]); for (const [nx, ny] of [[jx + 2, jy], [jx - 2, jy], [jx, jy + 2], [jx, jy - 2]]) { if (!black(nx, ny) || lab[ny * im.W + nx]) continue; lab[ny * im.W + nx] = 1; st.push([nx, ny]); } }
      if (pts.length > bn) { bn = pts.length; best = pts; }
    }
    // the screen's quad, measured in the screen's own frame: the black region's main axis (from its covariance) gives
    // the tilt; along that frame each edge gets a line fitted over its middle half (the corners' rounding and the
    // glass's sheen stay out), the top edge only either side of the middle (a phone's notch is as black as its
    // screen); the corners are where the lines meet, turned back into image px
    let mx = 0, my = 0; for (const q of best) { mx += q[0]; my += q[1]; } mx /= best.length; my /= best.length;
    let cxx = 0, cyy = 0, cxy = 0; for (const q of best) { const dx = q[0] - mx, dy = q[1] - my; cxx += dx * dx; cyy += dy * dy; cxy += dx * dy; }
    let th = 0.5 * Math.atan2(2 * cxy, cxx - cyy);               // the long axis' angle
    if (Math.abs(Math.cos(th)) < Math.abs(Math.sin(th))) th -= Math.PI / 2;   // keep u roughly along x, v along y
    const cs = Math.cos(th), sn = Math.sin(th);
    const U = (q) => [(q[0] - mx) * cs + (q[1] - my) * sn, -(q[0] - mx) * sn + (q[1] - my) * cs];
    const back = (u, v) => [mx + u * cs - v * sn, my + u * sn + v * cs];
    const pu = best.map(U);
    let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
    for (const [u, v] of pu) { if (u < u0) u0 = u; if (u > u1) u1 = u; if (v < v0) v0 = v; if (v > v1) v1 = v; }
    const bins = (key, val, lo, hi, keep) => {   // per bin of `key`, the min and max of `val`
      const mn = new Map(), mxm = new Map();
      for (const p of pu) { const kk = p[key], f = (kk - lo) / (hi - lo); if (!keep(f)) continue; const b = Math.round(kk / 3);
        if (!mn.has(b) || p[val] < mn.get(b)[1]) mn.set(b, [kk, p[val]]); if (!mxm.has(b) || p[val] > mxm.get(b)[1]) mxm.set(b, [kk, p[val]]); }
      return [[...mn.values()], [...mxm.values()]];
    };
    const mid = (f) => f > 0.25 && f < 0.75, sides = (f) => (f > 0.12 && f < 0.32) || (f > 0.68 && f < 0.88);
    const [left, right] = bins(1, 0, v0, v1, mid);          // u at each v: the left and right edges
    const [topS] = bins(0, 1, u0, u1, sides), [, bottom] = bins(0, 1, u0, u1, mid);
    const fit = (pts) => {
      const go = (P) => { let su = 0, sv = 0, suu = 0, suv = 0; for (const [a, b] of P) { su += a; sv += b; suu += a * a; suv += a * b; } const n = P.length, sl = (n * suv - su * sv) / (n * suu - su * su || 1); return [sl, (sv - sl * su) / n]; };
      let f = go(pts); const res = pts.map((q) => [Math.abs(q[1] - (f[0] * q[0] + f[1])), q]).sort((p, q) => p[0] - q[0]);
      return go(res.slice(0, Math.max(4, Math.floor(res.length * 0.8))).map((q) => q[1]));
    };
    const Lf = fit(left), Rf = fit(right), Tf = fit(topS), Bf = fit(bottom);   // sides: u = s·v + c; top, bottom: v = s·u + c
    const meet = (side, tb) => { const v = (tb[0] * side[1] + tb[1]) / (1 - tb[0] * side[0]); return back(side[0] * v + side[1], v); };
    // the frame's axis may come out upside down: name the corners by where they are in the image
    const cs4 = [meet(Lf, Tf), meet(Rf, Tf), meet(Rf, Bf), meet(Lf, Bf)].sort((p, q) => p[1] - q[1]);
    const [tl, tr] = cs4.slice(0, 2).sort((p, q) => p[0] - q[0]), [bl, br] = cs4.slice(2).sort((p, q) => p[0] - q[0]);
    const m = await layer(names[i], im, r, 1);
    const L = (q) => [+((q[0] - m.x0) * m.k).toFixed(1), +((q[1] - m.y0) * m.k).toFixed(1)];
    // the top edge's middle: the highest opaque pixel above the screen's centre column
    const cxs = Math.round((tl[0] + tr[0]) / 2); let ty = r.y; while (ty < r.y + r.h && A(im, cxs, ty) < 128) ty++;
    art.anchors[names[i]] = { screen: [L(tl), L(tr), L(br), L(bl)], attach: { x: L([cxs, ty])[0], y: L([cxs, ty])[1] } };
  }
}
/* ---- the bag: above the zipper's V is the back (the inside and the back panel), below it the front ---- */
if (existsSync(SRC + 'bag.png')) {
  const im = await load('bag.png'), r = bbox(im, (x, y) => A(im, x, y) > 8);
  // for each column, the zipper's V: the first dark tooth from the top inside the bag's middle 90%
  const vy = new Float64Array(im.W).fill(-1);
  for (let x = r.x + Math.round(r.w * 0.05); x < r.x + r.w * 0.95; x++) {
    for (let y = r.y; y < r.y + r.h * 0.85; y++) if (A(im, x, y) > 200 && lum(im, x, y) < 80) { vy[x] = y; break; }
  }
  // smooth the V and fill gaps (the slider and pull break it at the bottom)
  const V = new Float64Array(im.W);
  for (let x = 0; x < im.W; x++) { let s = 0, n = 0; for (let d = -12; d <= 12; d++) { const u = x + d; if (u >= 0 && u < im.W && vy[u] >= 0) { s += vy[u]; n++; } } V[x] = n ? s / n : -1; }
  for (let x = 0; x < im.W; x++) if (V[x] < 0) { let l = x; while (l >= 0 && V[l] < 0) l--; let h = x; while (h < im.W && V[h] < 0) h++; V[x] = l < 0 ? (h < im.W ? V[h] : r.y) : h >= im.W ? V[l] : V[l] + (V[h] - V[l]) * (x - l) / (h - l); }
  // the slider sits at the V's lowest point near the middle (the apex), its tab hanging below. The page draws one pull
  // throughout, the pouch's own (with the logo on its tab), so the render's pull comes out: the slider and the tab
  // (with a margin for its edge and shadow) are filled from the fabric either side, row by row
  let ax = Math.round(r.x + r.w / 2), ay = V[ax];
  for (let x = Math.round(r.x + r.w * 0.4); x < r.x + r.w * 0.6; x++) if (V[x] > ay) { ay = V[x]; ax = x; }
  // (if the render has one: a tab of saturated cobalt, taller than wide, hanging just below the apex)
  let tb = null;
  for (let y = Math.round(ay); y < Math.min(im.H, ay + r.w * 0.12) && !tb; y++) if (deepBlue(im, ax, y)) tb = tabBox(im, ax, y);
  if (tb && !(tb.x1 - tb.x0 < r.w * 0.15 && tb.y1 - tb.y0 > tb.x1 - tb.x0)) tb = null;
  const pad = Math.round(r.w * 0.008);
  const isPull = (x, y) => !!tb && ((Math.abs(x - ax) <= r.w * 0.04 && y >= ay - r.w * 0.035 && y <= tb.y0 + pad)
    || (x >= tb.x0 - pad && x <= tb.x1 + pad && y >= tb.y0 - pad && y <= tb.y1 + pad + r.w * 0.01));
  const filled = Buffer.from(im.d), reach = tb ? Math.ceil(Math.max(r.w * 0.04, (tb.x1 - tb.x0) / 2 + pad)) + 8 : 0;
  for (let y = Math.round(ay - r.w * 0.04); tb && y < Math.min(im.H, tb.y1 + pad + r.w * 0.012); y++) {
    for (let x = ax - reach; x <= ax + reach; x++) {
      if (!isPull(x, y)) continue;
      let b = x; while (isPull(b + 1, y)) b++;
      const side = (x0, x1) => { const c = [0, 0, 0, 0]; for (let u = x0; u <= x1; u++) for (let j = 0; j < 4; j++) c[j] += im.d[(y * im.W + u) * 4 + j]; return c.map((v) => v / (x1 - x0 + 1)); };
      const L = side(x - 4, x - 1), R = side(b + 1, b + 4);
      for (let u = x; u <= b; u++) { const t = (u - x + 1) / (b - x + 2), o = (y * im.W + u) * 4; for (let j = 0; j < 4; j++) filled[o + j] = Math.round(L[j] + (R[j] - L[j]) * t); }
      x = b;
    }
  }
  const clean = { d: filled, W: im.W, H: im.H };
  const below = (x, y) => y >= V[x] - 2;
  const k = Math.min(1, 2000 / r.w);
  const back = await layer('bag', clean, r, k, (x, y) => !below(x, y) || y < V[x] + 4);
  await layer('bag-front', clean, r, k, below);
  const mid = r.x + r.w / 2, vmin = Math.min(...Array.from({ length: Math.round(r.w * 0.6) }, (_, i) => V[Math.round(r.x + r.w * 0.2) + i]));
  // what the pouch slumps into (hero.js, pouch.js): the zipper's top ends (the corners the V opens to), the inside's
  // top edge (the back panel, seen over the front), the outline's half width down the bag, and the pull tab's width
  const LX = (x) => +((x - back.x0) * k).toFixed(1), LY = (y) => +((y - back.y0) * k).toFixed(1);
  let cl = null, cr = null;
  for (let y = r.y; y < r.y + r.h * 0.5 && !(cl && cr); y++) for (let x = r.x; x < r.x + r.w; x++) {
    if (A(im, x, y) < 200 || lum(im, x, y) >= 80) continue;
    if (x < mid && !cl) cl = [x, y]; if (x > mid && !cr) cr = [x, y];
  }
  let backTop = Math.round(r.y); while (backTop < ay && !(A(im, Math.round(mid), backTop) > 128 && blueish(im, Math.round(mid), backTop))) backTop++;
  const top = Math.min(cl[1], cr[1]), profile = [];
  for (let i = 0; i <= 16; i++) {
    const y = Math.min(r.y + r.h - 1, Math.round(top + (r.y + r.h - 1 - top) * i / 16));
    let half = 0; for (let x = r.x; x < r.x + r.w; x++) if (A(im, x, y) > 128) half = Math.max(half, Math.abs(x - mid));
    profile.push([LY(y), +(half * k).toFixed(1)]);
  }
  profile[0][1] = +(((cr[0] - cl[0]) / 2) * k).toFixed(1);   // at the top, the outline is the zipper's two ends
  art.anchors.bag = {
    mouth: { x: +((mid - back.x0) * k).toFixed(1), y: +((vmin - back.y0) * k).toFixed(1) },
    apex: { x: LX(ax), y: LY(ay) },   // where the page's pull hangs from: the V's lowest point
    corners: [[LX(cl[0]), LY(cl[1])], [LX(cr[0]), LY(cr[1])]], backTop: LY(backTop),
    tab: tb ? tabIn(tb, { x0: back.x0, y0: back.y0, k: k }) : null,   // the render's own tab, if any, filled over
    profile   // [y, half width from the middle], from the corners down
  };
}
writeFileSync(ART, JSON.stringify(art, null, 1));
console.log('wrote ' + ART);
