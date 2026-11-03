/* the side progress rail: a node per chapter, reached exactly at its rest point. The fill grows with a glow, and its
   glowing head brightens while the page moves (with the scroll speed) and settles when it stops. Each node shows its
   chapter as a tooltip on hover and focus; the current one keeps its label. A click glides to that chapter's rest. */
import { $, $$, clamp } from './util.js';
import { R, railFrac, chapterAt, yOf } from './scroll.js';
import { scrollToY } from './smooth.js';
import { Streak, streakColours } from './sparks.js';
import { onTheme } from './theme.js';

var rail = $('#rail'), fill = $('#railFill'), head = $('#railHead'), track = $('.rail .track'), btns = $$('#rail button');
var H = 0, cur = -1, glow = 0, lastF = -1;
// the progress as a light streak down the track (sparks.js), on a canvas just wider than the track
var fx = document.createElement('canvas'); fx.className = 'railfx'; fx.setAttribute('aria-hidden', 'true');
rail.insertBefore(fx, rail.firstChild);
var fctx = fx.getContext('2d'), streak = new Streak(streakColours()), dpr = 1, path = null, live = true, t = 0, PAD = 18;
onTheme(function () { streak.c = streakColours(); live = true; });
export function measureRail() {
  H = track.clientHeight; lastF = -1;
  dpr = Math.min(2, window.devicePixelRatio || 1);
  var w = PAD * 2, h = H + PAD * 2;
  fx.style.left = (track.offsetLeft + track.offsetWidth / 2 - PAD) + 'px'; fx.style.top = (track.offsetTop - PAD) + 'px';
  fx.style.width = w + 'px'; fx.style.height = h + 'px'; fx.width = Math.round(w * dpr); fx.height = Math.round(h * dpr);
  path = Streak.prep([{ x: PAD, y: PAD }, { x: PAD, y: PAD + H }]);
  live = true;
}
function drawRail(f, moving, dt) {
  if (!path || (!live && !moving)) return;
  t += dt;
  fctx.setTransform(dpr, 0, 0, dpr, 0, 0); fctx.clearRect(0, 0, PAD * 2, H + PAD * 2);
  live = streak.draw(fctx, path, Math.max(f, 0.0001), { width: 1.5, guide: 0, tail: 1, dust: 40, head: 7 + glow * 9, shed: glow * 90, time: t, dt: dt, k: 0.8 + glow * 0.2 }) || glow > 0.01;
}

export function updateRail(p, dt) {
  var f = railFrac(p);
  // glow follows the speed of the fill (fractions per second), rising fast and fading slowly
  var speed = lastF < 0 ? 0 : Math.abs(f - lastF) / Math.max(dt, 1 / 240);
  glow += (clamp(speed * 9) - glow) * (speed * 9 > glow ? 0.35 : 0.06);
  var moving = lastF !== f || glow > 0.002;
  drawRail(f, moving, dt);
  if (moving) {
    fill.style.transform = 'scaleY(' + f + ')';
    head.style.transform = 'translateY(' + (f * H) + 'px)';
    rail.style.setProperty('--glow', glow.toFixed(3));
    rail.style.setProperty('--tail', Math.min(72, f * H).toFixed(1) + 'px');   // never longer than the line drawn so far
    lastF = f;
  }
  var c = chapterAt(p);
  if (c !== cur) {
    cur = c;
    btns.forEach(function (b, i) {
      if (i === c) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      b.classList.toggle('done', i < c);
    });
  }
  return c;
}

var goFns = [];
export function onGo(fn) { goFns.push(fn); }
export function go(i) { goFns.forEach(function (fn) { fn(i); }); scrollToY(yOf(R[i]), true); }
btns.forEach(function (b) { b.addEventListener('click', function () { go(parseInt(b.dataset.go, 10)); }); });
