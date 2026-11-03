/* chapters 1–2: the pouch and its burst, from isolated Higgsfield renders (art.json, scripts/assets.mjs). Each object
   is placed in frame px: the pouch standing on the floor (warped open in WebGL, pouch.js), which once open slumps into
   the shape of the open bag, the bag render taking over as it lands; then the six tiles lift out of its mouth to an
   arc above it. The zipper engine (zipper.js) calls renderHero() every frame with the fabric's opening and the burst's
   progress (0..1, played over time once it's open, back when it closes). Floor reflections and contact shadows come
   from the stage (stage.js). */
import { gsap } from 'gsap';
import ART from './art.json';
import { PouchGL } from './pouch.js';
import { $, clamp, asset } from './util.js';
import { fit, onLayout } from './layout.js';
import { SITE } from './content.js';
import { contact } from './stage.js';
import { project, camState } from './camera.js';
import LOGO from './brand/enbd-logomark.svg?raw';

export var CX = 550, FLOOR = 612;          // the frame's centre line and the floor the objects stand on (frame px)
var camera = $('#camera'), ui = $('#ui');
function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }
function cut(name) {
  var L = ART.layers[name], img = el('img', 'cut');
  img.alt = ''; img.decoding = 'async'; img.draggable = false;
  img.src = asset(L.file + '.avif');
  img.onerror = function () { if (!img.dataset.fb) { img.dataset.fb = 1; img.src = asset(L.file + '.webp'); } };
  // decoded as soon as it arrives, not on its first paint (the burst's layers first paint mid-scroll)
  img.onload = function () { if (img.decode) img.decode().catch(function () {}); };
  return img;
}
function box(e, x, y, w, h) { e.style.left = x + 'px'; e.style.top = y + 'px'; e.style.width = w + 'px'; e.style.height = h + 'px'; return e; }

/* ---------- the pouch: 500 frame px tall (nearly square, as in Figma), standing on the floor ---------- */
var PL = ART.layers.pouch, PA = ART.anchors.pouch, PP = ART.layers['pouch-pull'], PPA = ART.anchors['pouch-pull'];
var PS = 500 / PL.h, PX = CX - PL.w * PS / 2, PY = FLOOR - PL.h * PS;     // scale and top-left of the pouch
var QS = 30 / PPA.tab.w;                                                  // the pull: its tab 30 frame px wide
// the open bag, measured (assets.mjs): 430 frame px wide on the floor. The pouch slumps into its outline
var BL = ART.layers.bag, BA = ART.anchors.bag;
var BS = 430 / BL.w, BW = BL.w * BS, BH = BL.h * BS, BX = CX - BW / 2, BY = FLOOR - BH;
var M = Math.round(PL.w * 0.07);                                          // the canvas's margin each side (layer px)
export var pouchRig = box(el('div', 'obj rig pouchrig'), PX, PY, PL.w * PS, PL.h * PS);
var canvas = box(el('canvas', 'pouchgl'), -M * PS, 0, (PL.w + 2 * M) * PS, PL.h * PS);
pouchRig.appendChild(canvas);
var still = cut('pouch'); still.classList.add('pouchstill'); still.style.width = '100%'; still.style.height = '100%';
pouchRig.appendChild(still);
// the pull: the slider and its cobalt tab, with the Emirates NBD logomark on the tab's face (vector, so it stays crisp
// at any size), centred and 56% of the tab's width. One pull through chapters 1 and 2: the pouch's rides the zipper;
// the bag's (below) is the same, where the pouch's lands, and takes over as the bag does
function makePull() {
  var w = el('div', 'pullsprite'); w.style.width = PP.w * QS + 'px'; w.style.height = PP.h * QS + 'px';
  var im = cut('pouch-pull'); im.style.width = '100%'; im.style.height = '100%'; w.appendChild(im);
  var lw = PPA.tab.w * QS * 0.56, lh = lw * 36 / 26.1, lg = el('span', 'pulllogo');
  lg.innerHTML = LOGO;
  lg.style.width = lw + 'px'; lg.style.height = lh + 'px';
  lg.style.left = (PPA.tab.x * QS - lw / 2) + 'px'; lg.style.top = (PPA.tab.y * QS - lh / 2) + 'px';
  w.appendChild(lg);
  return w;
}
var pullImg = makePull();
pouchRig.appendChild(pullImg);
var pouchShadow = contact(pouchRig, PL.w * PS / 2, PL.w * PS * 0.95, PL.h * PS - 4, 86);
camera.appendChild(pouchRig);
// where the sprite rides the seam, in frame px of the sprite: the slider's top centre, since the teeth part there (the
// V's apex sits at it, and closed, the slider stays inside the pouch's top edge, where the teeth start)
var SEAT = [PPA.seat.x * QS, 0];

// the bag's measurements in the pouch layer's px, for the slump
var toL = function (fy) { return (fy - PY) / PS; };
// the slider stops at the zipper's bottom stop, set where the bag's V ends: hanging there, the pull is the bag's
var zipEnd = toL(BY + BA.apex.y * BS);
var cornerY = toL(BY + Math.min(BA.corners[0][1], BA.corners[1][1]) * BS);
var prof = BA.profile.map(function (r, i, a) { return (r[1] || a[i - 1][1]) * BS / PS; });
var cardOf = function (name, dx, high, lift) { var T = ART.layers[name], w = 520; return { name: name, dx: dx, w: w, h: w * T.h / T.w, low: zipEnd + 60, high: high, lift: lift }; };
var span = zipEnd - PA.zipTop;
var gl = new PouchGL(canvas, { w: PL.w, h: PL.h }, {
  // the seam runs straight down the middle of the render
  seam: [[PA.seamTop, PA.zipTop], [(PA.seamTop + PA.seamBottom) / 2, (PA.zipTop + PA.zipBottom) / 2], [PA.seamBottom, PA.zipBottom]],
  zipTop: PA.zipTop, zipEnd: zipEnd, margin: M,
  slump: { cx: PL.w / 2, half: (PL.w - 12) / 2, sink: (zipEnd - cornerY) / span, prof: prof,
    profY: [toL(BY + BA.profile[0][0] * BS), toL(BY + BA.profile[16][0] * BS)], backEdge: toL(BY + BA.backTop * BS) },
  // the files inside, back to front: two plain tiles behind, the cobalt one (index.html) in front
  cards: [cardOf('tile-1', -250, zipEnd - span * 0.6, 140), cardOf('tile-4', 240, zipEnd - span * 0.57, 160), cardOf('tile-3', -15, zipEnd - span * 0.5, 220)]
});
export var glOk = gl.ok;
// resolves once the pouch and the files inside it are on the GPU (or can't be): the intro waits for both, so no
// upload lands mid-scroll (in the standalone file, where every image is decoded from embedded data, the files
// arrived late and their first draw was a 500–650 ms frame early in the unzip)
var heroDone, heroLeft = 2; export var heroReady = new Promise(function (r) { heroDone = function () { if (--heroLeft === 0) r(); }; });
if (gl.ok) {
  var src = new Image(); src.decoding = 'async';
  var up = function (b) { gl.setImage(b); still.style.visibility = 'hidden'; heroDone(); };
  src.onload = function () { (window.createImageBitmap ? createImageBitmap(src) : Promise.resolve(src)).then(up).catch(function () { up(src); }); };
  src.onerror = function () { if (!src.dataset.fb) { src.dataset.fb = 1; src.src = asset(PL.file + '.webp'); } };
  src.src = asset(PL.file + '.avif');
  // the files inside the pouch: the same tile renders the burst lifts out
  Promise.all(gl.A.cards.map(function (c) {
    return new Promise(function (res) {
      var im = new Image(); im.decoding = 'async';
      im.onload = function () { (window.createImageBitmap ? createImageBitmap(im) : Promise.resolve(im)).then(res).catch(function () { res(im); }); };
      im.onerror = function () { if (!im.dataset.fb) { im.dataset.fb = 1; im.src = asset(ART.layers[c.name].file + '.webp'); } else res(null); };
      im.src = asset(ART.layers[c.name].file + '.avif');
    });
  })).then(function (ims) { if (ims.every(Boolean)) gl.setCards(ims); heroDone(); });
} else { canvas.style.display = 'none'; heroLeft = 1; heroDone(); }

/* ---------- the bag and the tiles ---------- */
// the rig is the frame itself (0, 0), so its children are placed in frame px
export var bagRig = box(el('div', 'obj rig bagrig'), 0, 0, 1, 1);
// the master timeline moves the outer layers (bagBase, bagTop, each tile's outer box) in 2 → 3; the burst moves the
// inner ones, so the two never write the same element. Back (the inside), tiles, front (the fabric below the V)
var bagBase = el('div', 'bagbase'); bagRig.appendChild(bagBase);
var bagShadow = contact(bagBase, CX, BW * 1.02, FLOOR - 3, 90);
var bagBox = el('div', 'bagbox'); bagBase.appendChild(bagBox);
var bagImg = box(cut('bag'), BX, BY, BW, BH); bagBox.appendChild(bagImg);
var mouth = [BX + BA.mouth.x * BS, BY + BA.mouth.y * BS];
// where the pouch's pull lands at the end of the slump (frame px of the sprite's top left): the bag's pull hangs there
var landed = gl.slider(1, 1), bagPull = [PX + landed.x * PS - SEAT[0], PY + landed.y * PS];
// the arc the tiles land on: centre and height (frame px), left to right as content.js lists the files
var ARC = [[214, 352, 150], [342, 214, 150], [470, 318, 150], [604, 176, 158], [738, 216, 150], [868, 350, 150]];
var tiles = [];
for (var i = 0; i < 6; i++) {
  var name = 'tile-' + i, L = ART.layers[name], A = ART.anchors[name];
  var s = ARC[i][2] / L.h, w = L.w * s, h = L.h * s;
  // the render's centre of the tile (its bounding box has its tilt's slack) goes on the arc point
  var ox = ARC[i][0] - A.center.x * s, oy = ARC[i][1] - A.center.y * s;
  var outer = box(el('div', 'tile'), ox, oy, w, h), inner = el('div', 'tilein');
  var im = cut(name); im.style.width = '100%'; im.style.height = '100%';
  inner.appendChild(im); outer.appendChild(inner); bagRig.appendChild(outer);
  tiles.push({ i: i, outer: outer, inner: inner, file: SITE.files[i], cx: ARC[i][0], cy: ARC[i][1], w: w, h: h, cobalt: !!A.cobalt });
}
var bagTop = el('div', 'bagtop'); bagRig.appendChild(bagTop);
var frontBox = el('div', 'bagbox'); bagTop.appendChild(frontBox);
var bagFront = box(cut('bag-front'), BX, BY, BW, BH); frontBox.appendChild(bagFront);
// a marker on the bag's pull: once the burst is out the camera has moved, so the handle follows its real place
var bagPullEl = makePull(); bagPullEl.style.transform = 'translate(' + bagPull[0] + 'px,' + bagPull[1] + 'px)'; frontBox.appendChild(bagPullEl);
var pullMark = el('i', 'anchor'); pullMark.style.left = (bagPull[0] + SEAT[0]) + 'px'; pullMark.style.top = (bagPull[1] + PP.h * QS * 0.5) + 'px'; frontBox.appendChild(pullMark);
camera.appendChild(bagRig);

// the file chips, on the lower part of each tile, and the counter
var chips = tiles.map(function (t) {
  var c = el('div', 'filechip' + (t.file === SITE.entry ? ' entry' : ''));
  c.setAttribute('aria-hidden', 'true');
  c.innerHTML = '<i></i>' + t.file + (t.file === SITE.entry ? '<span class="tag">entry page</span>' : '');
  ui.appendChild(c); return c;
});
var counter = $('#counter'), counterText = $('#counterText');

/* ---------- the burst ---------- */
// the open pouch flops into the bag's shape (the slump, drawn by pouch.js), overshooting a little and settling; the
// bag render fades in over it as it lands, then the pouch goes; the files lift out of the mouth
var SL = { s: 0 };
var burst = gsap.timeline({ paused: true });
(function () {
  burst.fromTo(SL, { s: 0 }, { s: 1.04, duration: 0.42, ease: 'power2.in' }, 0);
  burst.to(SL, { s: 1, duration: 0.2, ease: 'sine.out' }, 0.42);
  burst.fromTo(bagShadow, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'none' }, 0.25);
  burst.fromTo([bagBox, frontBox], { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.inOut' }, 0.36);
  burst.to([canvas, still, pullImg, pouchShadow], { opacity: 0, duration: 0.1, ease: 'none' }, 0.56);
  tiles.forEach(function (t, j) {
    // from inside the mouth, where the files stood in the pouch, a little apart
    var dx = mouth[0] - t.cx + (j - 2.5) * 14, dy = mouth[1] - t.cy + 70;
    var spin = (j % 2 ? 1 : -1) * (7 + j * 2);
    burst.fromTo(t.inner, { x: dx, y: dy, z: -60, scale: 0.62, rotation: spin, opacity: 0 },
      { x: 0, y: 0, z: 0, scale: 1, rotation: 0, opacity: 1, duration: 1.35, ease: 'expo.out' }, 0.48 + j * 0.05);
  });
  burst.to({}, { duration: 0.2 });
})();
var BURST_LEN = burst.duration();
gsap.set([bagBox, frontBox], { transformOrigin: mouth[0] + 'px ' + FLOOR + 'px' });

/* ---------- per frame ---------- */
var sheen = { pos: -1, a: 0 };
export function setSheen(pos, a) { sheen.pos = pos; sheen.a = a; }
var dpr = Math.min(2, window.devicePixelRatio || 1);
onLayout(function () { dpr = Math.min(2, window.devicePixelRatio || 1); gl.resize((PL.w + 2 * M) * PS * fit.s, PL.h * PS * fit.s, dpr); gl.dirty = true; });
pullImg.style.transformOrigin = SEAT[0] + 'px 0px';

// q: the fabric's opening, k: the burst (0..1), tug: the rubber band (frame px, down is positive)
export function renderHero(q, k, tug) {
  if (burst.progress() !== k) burst.progress(k);
  var sl = SL.s;
  gl.set(clamp(q), sheen.pos, sheen.a, sl);
  gl.draw();
  var s = gl.slider(clamp(q), sl);
  pullImg.style.transform = 'translate(' + (s.x * PS - SEAT[0]) + 'px,' + (s.y * PS - SEAT[1]) + 'px)';
  pouchRig.style.translate = '0 ' + tug + 'px';
  bagRig.style.translate = '0 ' + tug + 'px';
}
export var burstLength = BURST_LEN;

// the pull's centre on screen, for the drag handle: on the pouch's slider, or on the bag's pull once it's out
export function pullScreen(q, k) {
  var s = gl.slider(clamp(q));
  var a = project(PX + s.x * PS - SEAT[0] + PP.w * QS / 2, PY + s.y * PS - SEAT[1] + PP.h * QS / 2, 0);
  if (k > 0) {
    var m = pullMark.getBoundingClientRect(), sr = document.getElementById('stage').getBoundingClientRect();
    a.x += (m.left + 1 - sr.left - a.x) * k; a.y += (m.top + 1 - sr.top - a.y) * k;
  }
  return a;
}
// the drag track on screen: from the slider's top to its bottom
export function track() {
  var a = gl.slider(0), b = gl.slider(1);
  var p0 = project(PX + a.x * PS, PY + a.y * PS, 0), p1 = project(PX + b.x * PS, PY + b.y * PS, 0);
  var dx = p1.x - p0.x, dy = p1.y - p0.y, L = Math.hypot(dx, dy) || 1;
  return { x0: p0.x, y0: p0.y, ux: dx / L, uy: dy / L, L: L };
}
export function pointerP(e, t) { return ((e.clientX - t.x0) * t.ux + (e.clientY - t.y0) * t.uy) / t.L; }

/* chapter 2: the chips land with the tiles and tick green as the files are checked; the counter counts. Both follow
   the camera (placed from the world, camera.js) */
var chipOn = [], chipOk = [], chipW = [], lastCount = -1, camV = -1, counterOn = -1, counterAt = -1;
export function updateChips(k, checkU, fade) {
  var moved = camState.version !== camV; camV = camState.version;
  tiles.forEach(function (t, j) {
    var c = chips[j];
    var show = clamp((k - 0.62 - j * 0.04) / 0.18) * (1 - fade);
    if (chipOn[j] !== show || (moved && show > 0)) {
      if (chipOn[j] !== show) c.style.opacity = show;
      chipOn[j] = show;
      var p = project(t.cx, t.cy + t.h * 0.3, 0);
      // on a phone the outer tiles run past the screen's edges: their chips stay on screen, clear of the rail
      var lo = (fit.vw <= 700 ? 30 : 12) + chipW[j] / 2, hi = fit.vw - 12 - chipW[j] / 2;
      p.x = Math.max(lo, Math.min(hi, p.x));
      c.style.transform = 'translate(-50%,-50%) translate(' + p.x + 'px,' + p.y + 'px) translateY(' + ((1 - show) * 8) + 'px)';
    }
    var ok = checkU >= (j + 1) / (tiles.length + 1);
    if (chipOk[j] !== ok) { chipOk[j] = ok; c.classList.toggle('ok', ok); }
  });
  var n = Math.round(SITE.fileCount * checkU), vis = clamp((k - 0.7) / 0.2) * (1 - fade);
  if (n !== lastCount) { lastCount = n; counterText.textContent = n + ' / ' + SITE.fileCount + ' files checked'; }
  if (vis !== counterOn) { counterOn = vis; counter.style.opacity = vis; }
  // under the bag, centred
  if (vis > 0 && counterAt !== camState.version) {
    counterAt = camState.version;
    var p = project(CX, FLOOR + 30, 0); counter.style.transform = 'translate(-50%,-50%) translate(' + p.x + 'px,' + p.y + 'px)';
  }
}
onLayout(function () {
  chipOn = []; camV = -1; counterAt = -1;
  chipW = chips.map(function (c) { return c.offsetWidth; });
});

// the tiles for the 2 → 3 transition (sets.js), in frame px
export function tileFrames() {
  var o = {};
  tiles.forEach(function (t) { o[t.file] = { x: t.cx, y: t.cy, w: t.w, outer: t.outer }; });
  return o;
}
// where the stage's shadows and reflections go (stage.js): the pouch and the bag, in frame px
export var footprints = { pouch: { x: CX, y: FLOOR, w: PL.w * PS * 0.9 }, bag: { x: CX, y: FLOOR, w: BW * 0.92 } };
export { tiles, bagBase, bagTop, pullImg, canvas, chips, counter, bagBox, frontBox };
export var streaks = null;
