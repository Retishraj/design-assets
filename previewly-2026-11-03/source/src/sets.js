/* chapters 3–6: glass panes in a CSS 3D scene, with the Northvale prototype's real screens on them (src/mockups),
   and the devices of chapter 6 (cut out of the Figma plate, art.json) with live screens mapped onto theirs.
   One pane carries the story through: it is the landing page in chapter 3, frosts over behind the keypad in 4,
   becomes the live dashboard that updates to v3 in 5, and flies into the laptop in 6.
   Each chapter's set stands at its own station (world.js): its poses are written in its own frame and moved there
   with at(), and the camera (camera.js) travels from station to station. What travels between sets (the files in
   2 → 3, the landing page from 3 to 5, into the laptop in 6) moves with the camera's own easing, so it stays framed
   while the studio passes behind it. Everything is animated on the master timeline (main.js), so it follows the
   scroll both ways. Only transforms and opacity move. */
import { gsap } from 'gsap';
import { $, reduced, asset, INVISIBLE } from './util.js';
import { T } from './scroll.js';
import { F, fit } from './layout.js';
import { landing, dashboard, statement, landingTablet, dashboardPhone } from './mockups/mockups.js';
import ART from './art.json';
import { contact } from './stage.js';
import { STATION, at, travel } from './world.js';

export var UPD = [714, 784];                 // chapter 5: the update rolls out (deploy card, beam, v2 → v3)
export var LAUNCH = [[904, 950], [916, 962], [928, 974]];   // chapter 6: the streams to the laptop, phone and tablet
var camera = $('#camera');

/* ---------- building blocks ---------- */
function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }

// a mockup inside a box of w×h frame px: rendered at its own size and scaled down
function screen(html, w, h, mw, mh) {
  var s = el('div', 'screen');
  s.style.width = w + 'px'; s.style.height = h + 'px';
  var inner = el('div', 'mkwrap', html);
  inner.style.transform = 'scale(' + (w / mw) + ',' + (h / mh) + ')';
  s.appendChild(inner);
  return s;
}

// a glass slab: the screen set into it, the rendered glass rim over it (a GPT Image 2.5 render of the plates' glass,
// assets/glass, drawn as a 9-slice so its corners and bevels keep their shape at any proportion), a sheen, a thickness
// edge on the right and the bottom, a tag
var PW = 636, PH = 411, SW = 600, SH = 375;   // the pane and its screen (16:10), frame px; the screen is inset 18 px
var RIM = 'url("' + asset('art/glass-rim.avif') + '")';
function pane(name, tagHtml) {
  var p = el('div', 'obj pane ' + name);
  p.style.width = PW + 'px'; p.style.height = PH + 'px';
  var face = el('div', 'face');
  var slot = el('div', 'slot');
  face.appendChild(slot);
  face.appendChild(el('div', 'sheen'));
  var rim = el('div', 'rim'); rim.style.borderImageSource = RIM; face.appendChild(rim);
  p.appendChild(face);
  p.appendChild(el('div', 'edge r'));
  p.appendChild(el('div', 'edge b'));
  if (tagHtml) p.appendChild(el('div', 'ptag', tagHtml));
  contact(p, PW / 2, PW * 0.9, PH + 78, 70).classList.add('far');   // the panes float: a soft pool on the floor below
  camera.appendChild(p);
  return { root: p, face: face, slot: slot, tag: p.querySelector('.ptag') };
}
function addScreen(pn, html, mw, mh, cls) { var s = screen(html, SW, SH, mw || 1440, mh || 900); if (cls) s.classList.add(cls); pn.slot.appendChild(s); return s; }

function cut(name, extra) {
  var L = ART.layers[name];
  var img = el('img', 'cut ' + (extra || ''));
  img.alt = ''; img.decoding = 'async'; img.draggable = false;
  img.src = asset(L.file + '.avif');
  img.onerror = function () { if (!img.dataset.fb) { img.dataset.fb = 1; img.src = asset(L.file + '.webp'); } };
  // decoded as soon as it arrives, not on its first paint (the burst's layers first paint mid-scroll)
  img.onload = function () { if (img.decode) img.decode().catch(function () {}); };
  return img;
}

/* ---------- the panes ---------- */
var P = {};
// chapter 3: the statement (back), the dashboard (middle) and the landing page (front, the hero pane)
P.pdf = pane('p-pdf', '<b>statement.pdf</b><span>PDF</span>');
addScreen(P.pdf, statement());
P.dash = pane('p-dash', '<b>dashboard.html</b><span>Dashboard</span>');
addScreen(P.dash, dashboard(1));
P.hero = pane('p-hero', '<b>index.html</b><span>Landing page</span>');
var heroLanding = addScreen(P.hero, landing(), 1440, 900, 'land');
// chapter 4: the landing page frosted over (a blurred copy, drawn once) and the cobalt padlock
var heroFrost = addScreen(P.hero, landing(), 1440, 900, 'frost');
P.hero.slot.appendChild(el('div', 'veil'));
// chapter 5: the live dashboard (v2), and v3 revealed over it by the beam
var heroV2 = addScreen(P.hero, dashboard(2), 1440, 900, 'v2');
var wipe = el('div', 'wipe'), wipeIn = el('div', 'wipein');
wipeIn.appendChild(screen(dashboard(3), SW, SH, 1440, 900));
wipe.appendChild(wipeIn); P.hero.slot.appendChild(wipe);
var beam = el('div', 'beam'); P.hero.slot.appendChild(beam);
// what v3 changed, ringed once the beam has passed: the mockup marks its new parts with data-new="3" (the merchant
// monograms count as one change). Drawn on their own layer over the screen, so the pane never repaints for them
var rings = el('div', 'rings'); P.hero.slot.appendChild(rings);
// the version switcher (ui.js) shows an older version on the live pane: v1 and v2 over everything, at rest invisible
var pickV = { 1: addScreen(P.hero, dashboard(1), 1440, 900, 'pick'), 2: addScreen(P.hero, dashboard(2), 1440, 900, 'pick') };
function drawRings() {
  var root = wipeIn.querySelector('.mk'), k = SW / 1440, boxes = [], mono = null;
  if (!root) return;
  function at(e) { var x = 0, y = 0, n = e; while (n && n !== root && n !== wipeIn) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return { x: x, y: y, w: e.offsetWidth, h: e.offsetHeight }; }
  root.querySelectorAll('[data-new="3"]').forEach(function (e) {
    var b = at(e);
    if (e.classList.contains('nv-monogram')) { mono = mono ? { x: Math.min(mono.x, b.x), y: Math.min(mono.y, b.y), r: Math.max(mono.r, b.x + b.w), b: Math.max(mono.b, b.y + b.h) } : { x: b.x, y: b.y, r: b.x + b.w, b: b.y + b.h }; }
    else boxes.push(b);
  });
  if (mono) boxes.push({ x: mono.x, y: mono.y, w: mono.r - mono.x, h: mono.b - mono.y });
  rings.innerHTML = '';
  boxes.forEach(function (b, i) {
    var r = el('div', 'ring');
    var pad = 6;
    r.style.left = (b.x - pad) * k + 'px'; r.style.top = (b.y - pad) * k + 'px';
    r.style.width = (b.w + 2 * pad) * k + 'px'; r.style.height = (b.h + 2 * pad) * k + 'px';
    r.style.animationDelay = (i * 0.25) + 's';
    r.appendChild(el('span', '', 'New'));
    rings.appendChild(r);
  });
}
// the versions behind it
P.v1 = pane('p-v1', '<b>v1</b><span>12 Oct</span>'); addScreen(P.v1, dashboard(1));
P.v2 = pane('p-v2', '<b>v2</b><span>19 Oct</span>'); addScreen(P.v2, dashboard(2));

var padlock = el('div', 'obj padlock');
(function () {
  var L = ART.layers.padlock, k = 176 / L.h;      // 176 frame px tall
  padlock.style.width = L.w * k + 'px'; padlock.style.height = L.h * k + 'px';
  var im = cut('padlock'); im.style.width = '100%'; im.style.height = '100%'; padlock.appendChild(im);
  contact(padlock, L.w * k / 2, L.w * k * 1.25, L.h * k - 3, 46);
  camera.appendChild(padlock);
})();

/* ---------- chapter 6: the devices ---------- */
// the three devices keep their arrangement from their render, scaled (K6) to 820 frame px across and centred
var K6 = 1, devs = {}, devWrap = el('div', 'obj devices');
camera.appendChild(devWrap);
var DEV = [
  // k: the page is painted at k of its size, about what it measures on screen, so its layer stays small (a full-size
  // page under a perspective transform is rasterised at full size, a 330 ms first paint)
  // drawn back to front as on the plate (art.json stacks): the phone stands in front of the laptop
  // fit: the screen quad grown (or, for the phone, whose rounded corners its quad overshoots, shrunk) about its centre
  { name: 'laptop', html: dashboard(3), mw: 1440, mh: 900, k: 0.36, fit: 1.004 },
  { name: 'tablet', html: landingTablet(), mw: 820, mh: 1180, k: 0.5, fit: 1.004 },
  { name: 'phone', html: dashboardPhone(), mw: 390, mh: 844, k: 0.45, fit: 0.988, notch: true }
];
(function () {
  var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  DEV.forEach(function (d) { var L = ART.layers[d.name]; minX = Math.min(minX, L.x); maxX = Math.max(maxX, L.x + L.w); minY = Math.min(minY, L.y); maxY = Math.max(maxY, L.y + L.h); });
  K6 = 820 / (maxX - minX);
  var w = (maxX - minX) * K6, h = (maxY - minY) * K6;
  devWrap.style.width = w + 'px'; devWrap.style.height = h + 'px';
  devWrap.dataset.w = w; devWrap.dataset.h = h;
  DEV.forEach(function (d) {
    var L = ART.layers[d.name], A = ART.anchors[d.name] || {};
    var box = el('div', 'device ' + d.name);
    box.style.left = (L.x - minX) * K6 + 'px'; box.style.top = (L.y - minY) * K6 + 'px';
    box.style.width = L.w * K6 + 'px'; box.style.height = L.h * K6 + 'px';
    var im = cut(d.name); im.style.width = '100%'; im.style.height = '100%'; box.appendChild(im);
    // the devices float: each casts its own soft pool on the floor below
    contact(devWrap, (L.x - minX + L.w / 2) * K6, L.w * K6 * 0.95, h + 56, 44).classList.add('far');
    // the screen quad in layer px, clockwise from top left, grown 1.2% about its centre so no edge of the plate's
    // own screen shows past the page
    var q = A.screen && overscan(A.screen, d.fit);
    var at = A.attach && (Array.isArray(A.attach) ? A.attach : [A.attach.x, A.attach.y]);
    var sw = d.mw * d.k, sh = d.mh * d.k;
    var scr = el('div', 'dscreen');
    scr.style.width = sw + 'px'; scr.style.height = sh + 'px';
    // the page is always drawn (so its paint is kept); the screen is off until a dark layer over it fades away
    var page = el('div', 'dpage', d.html); scr.appendChild(page);
    page.style.width = d.mw + 'px'; page.style.height = d.mh + 'px'; page.style.transform = 'scale(' + d.k + ')';
    scr.appendChild(el('div', 'boot'));
    scr.appendChild(el('div', 'flash'));
    if (d.notch) { var n = el('div', 'notch'); n.style.transform = 'scale(' + d.k + ')'; scr.appendChild(n); }
    if (q) scr.style.transform = matrix3d(sw, sh, q.map(function (pt) { return [pt[0] * K6, pt[1] * K6]; }));
    box.appendChild(scr);
    devWrap.appendChild(box);
    var mark = el('i', 'anchor'); mark.style.left = (at ? at[0] : L.w / 2) * K6 + 'px'; mark.style.top = (at ? at[1] : 0) * K6 + 'px'; box.appendChild(mark);
    devs[d.name] = { box: box, screen: scr, page: page, mark: mark, attach: at ? [(L.x - minX + at[0]) * K6, (L.y - minY + at[1]) * K6] : [L.w * K6 / 2 + (L.x - minX) * K6, (L.y - minY) * K6] };
  });
})();

function overscan(q, k) {
  var cx = (q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, cy = (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4;
  return q.map(function (p) { return [cx + (p[0] - cx) * k, cy + (p[1] - cy) * k]; });
}
// the CSS matrix3d that maps a w×h element onto the quad q (four [x, y], clockwise from top left)
function matrix3d(w, h, q) {
  var x0 = q[0][0], y0 = q[0][1], x1 = q[1][0], y1 = q[1][1], x2 = q[2][0], y2 = q[2][1], x3 = q[3][0], y3 = q[3][1];
  var dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2, sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  var den = dx1 * dy2 - dx2 * dy1, g = (sx * dy2 - dx2 * sy) / den, hh = (dx1 * sy - sx * dy1) / den;
  var a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, c = x0, d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3, f = y0;
  // from the unit square to the quad; then scale the element's w×h down to the unit square
  a /= w; d /= w; g /= w; b /= h; e /= h; hh /= h;
  return 'matrix3d(' + [a, d, 0, g, b, e, 0, hh, 0, 0, 1, 0, c, f, 0, 1].map(function (v) { return +v.toFixed(9); }).join(',') + ')';
}

/* ---------- the choreography ---------- */
// rest poses, in frame px (x, y: the centre; z toward the camera)
var CX = F.w / 2, FLOOR = 612;   // the stage's floor (stage.js)
// chapter 3: a centred line-up, the statement and the dashboard turned in on either side of the landing page
var HOST = {
  pdf: at(2, { x: CX - 340, y: 330, z: -240, rotationY: 38, rotationX: 0 }),
  dash: at(2, { x: CX + 340, y: 330, z: -240, rotationY: -38, rotationX: 0 }),
  hero: at(2, { x: CX, y: 338, z: 0, rotationY: 0, rotationX: 0 })
};
var PROTECT = { hero: at(3, { x: CX, y: 324, z: 30, rotationY: 0, rotationX: 0 }) };
// chapter 5: the versions stand in a row going back to the left, the live one in front
var UPDATE = {
  v1: at(4, { x: CX - 150, y: 300, z: -280, rotationY: -22, rotationX: 0 }),
  v2: at(4, { x: CX - 10, y: 312, z: -140, rotationY: -22, rotationX: 0 }),
  hero: at(4, { x: CX + 140, y: 326, z: 0, rotationY: -22, rotationX: 0 })
};
// the camera's travel, as a GSAP ease, for what it carries along
var TRAVEL = function (u) { return travel(u); };

export function initSets(tl, tiles) {
  var all = [P.pdf, P.dash, P.hero, P.v1, P.v2];
  all.forEach(function (pn, i) { gsap.set(pn.root, Object.assign({ xPercent: -50, yPercent: -50, opacity: 0 }, at(i < 3 ? 2 : 4, { x: CX, y: 330, z: -400 }))); });
  // v1 and v2 first appear in chapter 5, long after the priming: they wait at an invisible opacity, so their paint is
  // kept (from 0, v1's first frame sliding in was a 67 ms repaint)
  gsap.set([P.v1.root, P.v2.root], { opacity: INVISIBLE });
  // the layers inside the hero pane rest at an invisible opacity, never 0, so the browser keeps their paint (the
  // frosted copy's blur cost 500 ms to repaint on a slow phone)
  var veil = P.hero.slot.querySelector('.veil');
  gsap.set([heroFrost, heroV2, veil], { opacity: INVISIBLE });
  // the switcher's versions are only shown on a click, at rest: hidden outright until then (kept at an invisible
  // opacity they showed through the pane as a faint ghost, being composited after the wipe's clip)
  gsap.set([pickV[1], pickV[2]], { autoAlpha: 0 });
  gsap.set(rings, { opacity: 0 });
  gsap.set(wipe, { xPercent: -100 }); gsap.set(wipeIn, { xPercent: 100 }); gsap.set(beam, { opacity: 0, x: 0 });
  gsap.set(padlock, Object.assign({ xPercent: -50, yPercent: -100, opacity: INVISIBLE }, at(3, { x: CX + 250, y: FLOOR - 4, z: 70 })));
  // on phones the three devices stand a little smaller, so the phone and the tablet aren't cut by the screen's edges
  var DS = fit.narrow ? 0.8 : 1;
  gsap.set(devWrap, Object.assign({ xPercent: -50, yPercent: -50, opacity: INVISIBLE, scale: 0.92 * DS }, at(5, { x: CX, y: 460, z: 0 })));

  /* 2 → 3: three of the tiles carry their files up into the panes (tiles: hero.js's tile elements, by file name) */
  var a = T[1][0], b = T[1][1], d = b - a;
  [['pdf', 'statement.pdf'], ['dash', 'dashboard.html'], ['hero', 'index.html']].forEach(function (pair, i) {
    var pn = P[pair[0]], from = tiles && tiles[pair[1]];
    var start = from ? { x: from.x, y: from.y, z: 40, rotationY: 0, rotationX: 0, rotationZ: from.rot || 0, scale: from.w / PW } : { x: CX, y: 330, z: -200, scale: 0.3 };
    // they fly with the camera's travel, so it follows them to the next station
    tl.fromTo(pn.root, start, Object.assign({ rotationZ: 0, scale: 1, ease: TRAVEL, duration: d * 0.84, immediateRender: false }, HOST[pair[0]]), a + d * (0.1 + i * 0.03));
    tl.fromTo(pn.root, { opacity: 0 }, { opacity: 1, duration: d * 0.12, ease: 'none', immediateRender: false }, a + d * (0.1 + i * 0.03));
  });

  /* 3 → 4: the statement and the dashboard drift back and fade; the landing page travels with the camera to the next
     station, where it faces us and frosts over; the padlock drops in at its foot */
  a = T[2][0]; b = T[2][1]; d = b - a;
  tl.to(P.pdf.root, { x: '-=220', z: '-=220', rotationY: 60, opacity: 0, duration: d * 0.45, ease: 'power2.in' }, a);
  tl.to(P.dash.root, { x: '+=220', z: '-=220', rotationY: -60, opacity: 0, duration: d * 0.45, ease: 'power2.in' }, a + d * 0.03);
  tl.to(P.hero.root, Object.assign({ duration: d, ease: TRAVEL }, PROTECT.hero), a);
  tl.to(P.hero.tag, { opacity: 0, duration: d * 0.2 }, a);
  tl.fromTo([heroFrost, veil], { opacity: INVISIBLE }, { opacity: 1, duration: d * 0.35, ease: 'none', immediateRender: false }, a + d * 0.42);
  tl.fromTo(padlock, { y: FLOOR - 4 - 300, opacity: INVISIBLE, rotationZ: -8 }, { y: FLOOR - 4, opacity: 1, rotationZ: 0, duration: d * 0.34, ease: reduced ? 'power2.out' : 'bounce.out', immediateRender: false }, a + d * 0.62);

  /* 4 → 5: the keypad sinks into the padlock (handoffs, ui.js), the padlock backs away into the depth; the frost clears
     onto the live dashboard (v2), which turns into the versions' line-up as v1 and v2 slide in behind it */
  a = T[3][0]; b = T[3][1]; d = b - a;
  tl.to(padlock, { z: STATION[3][2] - 280, x: '+=60', opacity: 0, duration: d * 0.34, ease: 'power2.in' }, a + d * 0.22);
  tl.fromTo(heroV2, { opacity: INVISIBLE }, { opacity: 1, duration: d * 0.3, ease: 'none', immediateRender: false }, a + d * 0.35);
  tl.fromTo([heroFrost, veil], { opacity: 1 }, { opacity: INVISIBLE, duration: d * 0.3, ease: 'none', immediateRender: false }, a + d * 0.45);
  tl.to(P.hero.root, Object.assign({ duration: d, ease: TRAVEL }, UPDATE.hero), a);
  tl.to(P.hero.tag, { opacity: 1, duration: d * 0.2 }, a + d * 0.8);
  tl.fromTo(P.v1.root, at(4, { x: CX - 520, y: 300, z: -420, rotationY: -22, opacity: INVISIBLE }), Object.assign({ opacity: 1, duration: d * 0.5, ease: 'power3.out', immediateRender: false }, UPDATE.v1), a + d * 0.5);

  /* the update: the beam sweeps across the live pane and v3 is behind it; v2 then slides back into the line-up */
  a = UPD[0]; b = UPD[1]; d = b - a;
  tl.fromTo(beam, { opacity: 0 }, { opacity: 1, duration: d * 0.08, ease: 'none', immediateRender: false }, a + d * 0.1);
  tl.fromTo(beam, { x: 0 }, { x: SW, duration: d * 0.7, ease: 'power1.inOut', immediateRender: false }, a + d * 0.1);
  tl.fromTo(wipe, { xPercent: -100 }, { xPercent: 0, duration: d * 0.7, ease: 'power1.inOut', immediateRender: false }, a + d * 0.1);
  tl.fromTo(wipeIn, { xPercent: 100 }, { xPercent: 0, duration: d * 0.7, ease: 'power1.inOut', immediateRender: false }, a + d * 0.1);
  tl.to(beam, { opacity: 0, duration: d * 0.1, ease: 'none' }, a + d * 0.8);
  drawRings();
  tl.fromTo(rings, { opacity: 0 }, { opacity: 1, duration: 8, ease: 'none', immediateRender: false }, b + 2);
  tl.to(rings, { opacity: 0, duration: 8, ease: 'none' }, T[4][0]);
  tl.fromTo(P.v2.root, Object.assign({ opacity: INVISIBLE }, UPDATE.hero), Object.assign({ opacity: 1, duration: d * 0.4, ease: 'power3.out', immediateRender: false }, UPDATE.v2), a + d * 0.72);

  /* 5 → 6: the line-up falls back; the live pane travels with the camera and dives into the laptop at the last
     station; the devices rise into place */
  a = T[4][0]; b = T[4][1]; d = b - a;
  tl.to([P.v1.root, P.v2.root], { z: '-=320', x: '-=120', opacity: 0, duration: d * 0.45, ease: 'power2.in', stagger: d * 0.05 }, a);
  tl.fromTo(devWrap, { y: 460, opacity: INVISIBLE, scale: 0.92 * DS }, { y: 360, opacity: 1, scale: DS, duration: d * 0.6, ease: 'power3.out', immediateRender: false }, a + d * 0.25);
  tl.to(P.hero.root, at(5, { x: CX + 6, y: 352, z: -40, rotationY: 0, rotationX: 0, scale: 0.46, duration: d * 0.95, ease: TRAVEL }), a + d * 0.05);
  tl.to(P.hero.root, { opacity: 0, duration: d * 0.18, ease: 'none' }, a + d * 0.7);

  /* each screen opens the page as its stream arrives: a flash, then the page over the dark glass */
  ['laptop', 'phone', 'tablet'].forEach(function (name, i) {
    var dv = devs[name], lands = LAUNCH[i][1];
    tl.fromTo(dv.screen.querySelector('.flash'), { opacity: 0 }, { opacity: 0.85, duration: 3, ease: 'none', immediateRender: false }, lands - 2);
    tl.to(dv.screen.querySelector('.flash'), { opacity: 0, duration: 9, ease: 'power2.out' }, lands + 1);
    tl.fromTo(dv.screen.querySelector('.boot'), { opacity: 1 }, { opacity: 0, duration: 6, ease: 'none', immediateRender: false }, lands + 1);
  });
}

// the hero pane's tag follows the story: the landing page in 3, the live version in 5, or the version picked
var tagState = '', picked = 3;
export function updateSets(p) {
  var t = p < T[3][0] ? 'host' : p < UPD[1] ? 'v2' : 'v3';
  var key = t + picked;
  if (key === tagState) return; tagState = key;
  P.hero.tag.innerHTML = t === 'host' ? '<b>index.html</b><span>Landing page</span>' : t === 'v2' ? '<b>v2</b><span>Live</span>'
    : picked === 3 ? '<b>v3</b><span>Live</span>' : '<b>v' + picked + '</b><span>' + (picked === 1 ? '12 Oct' : '19 Oct') + '</span>';
}
// shows version v (1, 2 or 3) on the live pane; the line-up behind marks the one being viewed
export function pickVersion(v, instant) {
  picked = v;
  var d = instant || reduced ? 0 : 0.5;
  gsap.to(pickV[1], { autoAlpha: v === 1 ? 1 : 0, duration: d, ease: 'power2.out', overwrite: 'auto' });
  gsap.to(pickV[2], { autoAlpha: v === 2 ? 1 : 0, duration: d, ease: 'power2.out', overwrite: 'auto' });
  rings.style.visibility = v === 3 ? '' : 'hidden';
  P.v1.root.classList.toggle('viewing', v === 1); P.v2.root.classList.toggle('viewing', v === 2);
}

/* page elements placed from the sets' rest poses */
export function devicesBox() {
  return { w: +devWrap.dataset.w, h: +devWrap.dataset.h };
}
export { P, padlock, devs, devWrap, beam, heroV2, wipe, rings };
