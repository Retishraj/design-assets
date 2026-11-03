/* boot and the frame loop. The scroll position (Lenis-smoothed) is the master timeline's time: everything scrubbed
   between rest points lives on it (sets.js, the hero's hand-over to chapter 3, the halo), and it places the camera
   (camera.js). Each frame then steps the zipper, the URL bar, the rail, the copy reveals, the page elements and the
   streams.
   Import order is set-up order. */
import { gsap } from 'gsap';
import { reduced, clamp, ease } from './util.js';
import './theme.js';
import './stage.js';
import { measure, pos, chapterAt, noteScroll, T, END, R } from './scroll.js';
import { layoutAll, onLayout, toScreen, fit } from './layout.js';
import { onFrame } from './smooth.js';
import { tileFrames, updateChips, tiles, bagBase, bagTop, streaks, renderHero, heroReady } from './hero.js';
import { initSets, updateSets } from './sets.js';
import { stepZipper, scrollMode } from './zipper.js';
import { CHECK, updateBar } from './bar.js';
import { measureRail, updateRail, onGo } from './rail.js';
import { initReveal, updateReveal } from './reveal.js';
import { updateUI } from './ui.js';
import { updateStreams } from './streams.js';
import { playIntro } from './intro.js';
import { applyCamera } from './camera.js';

var master = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
var haloRig = document.getElementById('haloRig');

function build() {
  initSets(master, tileFrames());
  // 2 → 3: the bag sinks into the floor, the tiles that don't become panes drift out and fade
  var a = T[1][0], b = T[1][1], d = b - a;
  master.to([bagBase, bagTop], { y: 110, opacity: 0, duration: d * 0.3, ease: 'power2.in' }, a);
  if (streaks) master.to(streaks, { opacity: 0, duration: d * 0.2 }, a);
  tiles.forEach(function (t, i) {
    var becomes = ['statement.pdf', 'dashboard.html', 'index.html'].indexOf(t.file) >= 0;
    if (becomes) master.to(t.outer, { opacity: 0, scale: 1.25, duration: d * 0.12, ease: 'power1.in' }, a + d * (0.1 + i * 0.01));
    else master.to(t.outer, { y: -120 - i * 12, x: (i - 2.5) * 40, opacity: 0, rotation: (i - 2.5) * 6, duration: d * 0.45, ease: 'power2.in' }, a + d * 0.06);
  });
  // the halo is each set's light: it shapes itself to the subject of each chapter, brighter where there is cobalt
  // light, and dims while the camera travels between stations (the studio between the sets is unlit)
  master.set(haloRig, { opacity: 1, scale: 1, y: 0 }, 0)
    .to(haloRig, { scale: 1.15, y: -40, opacity: 0.85, duration: T[0][1] - T[0][0] }, T[0][0]);
  [[1.3, -10, 0.45], [0.95, 0, 0.75], [1.35, -20, 0.5], [1.5, -150, 0.8]].forEach(function (h, i) {
    var a0 = T[i + 1][0], d0 = T[i + 1][1] - a0;
    master.to(haloRig, { scale: h[0], y: h[1], duration: d0 }, a0)
      .to(haloRig, { opacity: 0.15, duration: d0 * 0.45, ease: 'sine.inOut' }, a0)
      .to(haloRig, { opacity: h[2], duration: d0 * 0.45, ease: 'sine.inOut' }, a0 + d0 * 0.55);
  });
  master.set({}, {}, END);
}

function layout() {
  measure(); layoutAll(); measureRail();
}
onLayout(function () {
  var c = toScreen(550, 330), st = haloRig.style;
  st.setProperty('--hx', c.x + 'px'); st.setProperty('--hy', c.y + 'px'); st.setProperty('--hs', Math.round(980 * fit.s) + 'px');
});

var started = false, lastP = -1, introDone = false;   // introDone: the copy may come in
function frame(dt, now) {
  noteScroll(now);
  var p = pos(), c = chapterAt(p);
  if (p !== lastP) { master.time(p); applyCamera(p); lastP = p; }
  var z = stepZipper(dt, now, p < T[1][1]);
  var fade = ease((p - T[1][0]) / ((T[1][1] - T[1][0]) * 0.3));
  updateChips(z.k, clamp((p - CHECK[0]) / (CHECK[1] - CHECK[0])), fade);
  updateBar(p, z.p, c, dt);
  updateRail(p, dt);
  updateReveal(p, !introDone);
  updateSets(p);
  updateUI(p, c);
  updateStreams(p, now, c === 5);
}

// the art is hidden from the first paint (index.html: the frame at opacity 0) until the sets are placed: before that
// every pane and device stands at its element's default spot, piled in the frame's top corner.
// first paints: every set is shown once at its rest, invisibly (the frame at 0.4% opacity), before the intro, so the
// browser has rasterised each pane, the frosted copy, the versions and the devices before the reader meets them.
// Without it, each one's first paint landed mid-transition as a 250–900 ms frame
// the next painted frame, or 120 ms on, whichever is first (a background tab gets no frames until it's shown)
function nextFrame(cb) { var called = false, go = function () { if (!called) { called = true; cb(); } }; requestAnimationFrame(function () { requestAnimationFrame(go); }); setTimeout(go, 120); }
function prime(done) {
  var fr = document.getElementById('frame'), stops = [R[1], R[2], R[3], 780, R[4], R[5]], i = 0;
  if (reduced) { fr.style.opacity = ''; done(); return; }
  fr.style.opacity = 0.004;
  (function next() {
    if (i < stops.length) {
      // at chapter 2 the burst is shown landed (it runs on the zipper's clock, not the timeline); the zipper's first
      // frame puts it back
      if (stops[i] === R[1]) renderHero(1, 1, 0);
      master.time(stops[i]); applyCamera(stops[i++]); nextFrame(next); return;
    }
    master.time(pos()); applyCamera(pos()); lastP = -1;
    nextFrame(function () { fr.style.opacity = ''; done(); });
  })();
}

function start() {
  if (started) return; started = true;
  layout();
  build();
  initReveal();
  prime(function () {
    master.time(pos());
    onFrame(frame);
    playIntro(function () { introDone = true; });
  });
}

// resize: only when the stage really changes (mobile toolbars sliding don't)
var lastW = 0, lastH = 0, rT = 0;
addEventListener('resize', function () {
  clearTimeout(rT);
  rT = setTimeout(function () {
    var st = document.getElementById('stage');
    if (st.clientWidth === lastW && Math.abs(st.clientHeight - lastH) < 80) return;
    lastW = st.clientWidth; lastH = st.clientHeight;
    var p = pos(); layout(); master.time(p); lastP = -1;
  }, 120);
});
onGo(function () { scrollMode(); });

// start once the fonts are in (so the copy splits into its real lines), or after a moment regardless
var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
// and the pouch is on the GPU (its upload is a long frame); after 2.5 s it starts regardless
Promise.race([Promise.all([fontsReady, heroReady]), new Promise(function (r) { setTimeout(r, 2500); })]).then(function () { requestAnimationFrame(start); });
