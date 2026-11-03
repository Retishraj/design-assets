/* zipper engine: one progress value (0 closed, 1 open) that drag, momentum, keys and scroll all write to, and one
   per-frame step that reads it: the fabric spring with tooth detents, the burst once it's open, the rubber band past
   either end and the pull handle. The picture is the Figma pouch, warped open in WebGL (hero.js, pouch.js).
   Designer-tuned values: fabric lag 0.17 s, detents 0.55, flick 0.9, breakaway 17 px. */
import { $, clamp, reduced } from './util.js';
import { Z0, Z1, pos, yOf, chapterAt } from './scroll.js';
import { renderHero, pullScreen, track, pointerP, burstLength } from './hero.js';
import { ensureAudio, tick } from './sound.js';
import { statusEl } from './state.js';
import { scrollToY } from './smooth.js';

function Spring(v) { this.x = v; this.v = 0; this.t = v; }
Spring.prototype.step = function (dt, response, damping) { if (response <= 0.001) { this.x = this.t; this.v = 0; return; } var w = 2 * Math.PI / response, k = w * w, c = 2 * damping * w, n = Math.max(1, Math.ceil(dt / 0.004)), h = dt / n; for (var i = 0; i < n; i++) { this.v += (k * (this.t - this.x) - c * this.v) * h; this.x += this.v * h; } };
Spring.prototype.settled = function (eps) { eps = eps || 1e-4; return Math.abs(this.t - this.x) < eps && Math.abs(this.v) < eps * 20; };
// pull: where the reader has the zipper (1:1 with the pointer); body: the fabric and teeth, following on a stiff
// spring tooth by tooth (the picture shows this one); tug: the rubber band past either end
var pull = new Spring(0), body = new Spring(0), tug = new Spring(0);
var tune = { lag: 0.17, detent: 0.55, flick: 0.9, breakPx: 17 }, TEETH = 74;
var CLOSE_S = 0.6;   // closing, the tiles go back in over 0.6 s; opening, the burst plays at its own length

var handle = $('#pull');
var mode = 'scroll', dragging = false, grab = null, pKey = 0, momentumDamp = 1, opened = false, k = 0, lastSetScroll = -1;
function zipScrollY(p) { return yOf(Z0 + p * (Z1 - Z0)); }
function pFromScroll() { var p = pos(); if (chapterAt(p) > 0) return 1; return clamp((p - Z0) / (Z1 - Z0)); }
function syncScroll(p) { var y = zipScrollY(p); if (Math.abs(y - window.scrollY) > 1) { lastSetScroll = y; scrollToY(y, false); } }
addEventListener('scroll', function () { if (dragging) return; if (lastSetScroll < 0 || Math.abs(window.scrollY - lastSetScroll) > 2) { mode = 'scroll'; lastSetScroll = -1; } }, { passive: true });
addEventListener('wheel', function () { if (!dragging) { mode = 'scroll'; lastSetScroll = -1; } }, { passive: true });

handle.addEventListener('pointerdown', function (e) {
  if (e.button > 0) return; e.preventDefault(); try { handle.setPointerCapture(e.pointerId); } catch (_) {}
  ensureAudio();
  var trk = track(), t = pointerP(e, trk);
  dragging = true; mode = 'drag';
  grab = { trk: trk, offset: t - pull.x, start: pull.x, raw: pull.x, locked: pull.x < 0.003 && tune.breakPx > 0, catchUp: 0, hist: [] };
  pull.v = 0; pull.t = pull.x; document.body.classList.add('dragging');
});
handle.addEventListener('pointermove', function (e) { if (!dragging || !grab) return; grab.raw = pointerP(e, grab.trk) - grab.offset; });
var release = function () {
  if (!dragging) return; dragging = false; document.body.classList.remove('dragging');
  ensureAudio();   // on touch, pointerdown doesn't count as a user gesture for audio but pointerup does
  var v = 0, h = grab ? grab.hist : [];
  if (h.length > 1) { var a = h[0], b = h[h.length - 1], dt = (b.t - a.t) / 1000; if (dt > 0.008) v = (b.p - a.p) / dt; }
  v = clamp(v, -12, 12);
  var basePos = pull.x; if (grab && (!grab.locked || Math.abs(grab.raw - grab.start) * grab.trk.L >= tune.breakPx)) basePos = clamp(grab.raw);
  var rate = 0.985 + tune.flick * 0.012, end = clamp(basePos + v * (rate / (1 - rate)) / 1000);
  if (end > 0.955) end = 1; else if (end < 0.03 && pull.x < 0.12) end = 0;
  mode = 'momentum'; pull.t = end; pull.v = v; momentumDamp = (end === 1 || end === 0) ? 0.72 : 1; tug.t = 0; grab = null;
};
handle.addEventListener('pointerup', release); handle.addEventListener('pointercancel', release); handle.addEventListener('lostpointercapture', release);
handle.addEventListener('keydown', function (e) {
  var base = mode === 'key' ? pKey : pull.x, n = null;
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = base + 0.04; else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = base - 0.04;
  else if (e.key === 'PageDown') n = base + 0.2; else if (e.key === 'PageUp') n = base - 0.2; else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = 1;
  if (n === null) return; e.preventDefault(); pKey = clamp(n); mode = 'key';
});

// hands the zipper back to the page scroll (rail jumps)
export function scrollMode() { mode = 'scroll'; lastSetScroll = -1; }

var lastTooth = 0, ariaVal = -1, live = null;
// advances the zipper by one frame and draws the hero; returns { p, k }. onHero: the hero is on screen
export function stepZipper(dt, now, onHero) {
  if (mode === 'drag' && grab) {
    var target = grab.raw, prev = pull.x;
    if (grab.locked) {
      var travel = Math.abs(target - grab.start) * grab.trk.L;
      if (travel >= tune.breakPx) { grab.locked = false; grab.catchUp = target - pull.x; }
      else { pull.x = clamp(grab.start + (target - grab.start) * 0.22); tug.t = -Math.sign(target - grab.start) * 0.06 * (travel / Math.max(1, tune.breakPx)); }
    }
    if (!grab.locked) { grab.catchUp *= Math.exp(-dt / 0.05); var desired = target - grab.catchUp; pull.x = clamp(desired); var over = desired - pull.x, ow = Math.abs(over) * 2.7; tug.t = -Math.sign(over) * 0.2 * ow / (0.35 + ow); }
    pull.v = (pull.x - prev) / dt; pull.t = pull.x;
    grab.hist.push({ t: now, p: pull.x }); while (grab.hist.length > 2 && now - grab.hist[0].t > 90) grab.hist.shift();
    syncScroll(pull.x);
  } else if (mode === 'momentum') {
    pull.step(dt, reduced ? 0.001 : 0.32, momentumDamp);
    if (pull.x > 1) { pull.x = 1; pull.v = -Math.abs(pull.v) * 0.25; } if (pull.x < 0) { pull.x = 0; pull.v = Math.abs(pull.v) * 0.25; }
    syncScroll(pull.x); if (pull.settled(2e-4)) { pull.x = pull.t; pull.v = 0; mode = 'idle'; }
  } else if (mode === 'key') {
    pull.t = pKey; pull.step(dt, reduced ? 0.001 : 0.16, 1); syncScroll(pull.x); if (pull.settled(2e-4)) { pull.x = pull.t; mode = 'idle'; }
  } else if (mode === 'scroll') { pull.t = pFromScroll(); pull.step(dt, reduced ? 0.001 : 0.12, 1); }
  pull.x = clamp(pull.x); var p = pull.x;

  // the fabric, pulled toward the nearest tooth; held open while the tiles are out, so they go back in first
  var q = Math.round(pull.x * TEETH) / TEETH;
  body.t = clamp(pull.x + tune.detent * 0.9 * (q - pull.x)); if (k > 0) body.t = 1;
  body.step(dt, reduced ? 0.001 : tune.lag, 0.82); body.x = clamp(body.x, -0.01, 1.01);
  var tooth = Math.floor(clamp(body.x) * TEETH + 0.5);
  if (tooth !== lastTooth) { if (onHero) tick(Math.min(1, Math.abs(body.v) * 1.5)); lastTooth = tooth; }

  // the burst: plays out once the zipper is open, and runs back when the reader closes it
  if (!opened && body.x > 0.985 && pull.x > 0.95) { opened = true; statusEl.textContent = 'Unzipped. Six files are out.'; }
  else if (opened && pull.x < 0.93) { opened = false; statusEl.textContent = 'Zipper closing.'; }
  k = clamp(k + (opened ? dt / (reduced ? 0.3 : burstLength) : -dt / (reduced ? 0.2 : CLOSE_S)));

  tug.step(dt, 0.2, reduced ? 1 : 0.6);
  renderHero(body.x, k, -tug.x * 140);

  // the handle sits on the pull, or under the pointer while dragging; only while the hero is on screen
  if (onHero !== live) { live = onHero; handle.style.visibility = onHero ? 'visible' : 'hidden'; }
  if (onHero) { var sp = pullScreen(dragging ? pull.x : body.x, dragging ? 0 : k); handle.style.transform = 'translate(' + (sp.x - handle.offsetWidth / 2) + 'px,' + (sp.y - handle.offsetHeight / 2) + 'px)'; }
  var av = Math.round(pull.x * 100); if (av !== ariaVal) { ariaVal = av; handle.setAttribute('aria-valuenow', av); handle.setAttribute('aria-valuetext', av === 0 ? 'Zipped closed' : av === 100 ? 'Fully open' : av + '% open'); }
  return { p: p, k: k };
}
