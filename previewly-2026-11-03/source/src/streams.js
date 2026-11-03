/* chapter 6: the link goes out. Three light streams launch from the pinned URL bar and feed down to the laptop, the
   phone and the tablet; each screen opens the page as its stream arrives (sets.js boots them on the master timeline).
   Each is a sparkling streak (sparks.js), cobalt at the bar to cyan at the device: while it launches, a flaring head
   that sheds sparks; once connected, the whole line twinkles and packets of light run down it. Drawn on one canvas in
   screen space, only while chapter 6 is on screen. */
import { $, clamp, reduced } from './util.js';
import { onLayout } from './layout.js';
import { gsap } from 'gsap';
import { devs, devWrap, LAUNCH } from './sets.js';
import { onTheme } from './theme.js';
import { Streak, streakColours } from './sparks.js';
import { project } from './camera.js';

var ORDER = ['laptop', 'phone', 'tablet'];
var bar = $('#bar'), stage = $('#stage');
var cv = document.createElement('canvas'); cv.className = 'streams'; cv.setAttribute('aria-hidden', 'true');
stage.insertBefore(cv, $('#ui'));
var ctx = cv.getContext('2d'), W = 0, H = 0, dpr = 1;

onTheme(function () { streaks = null; });
onLayout(function () {
  dpr = Math.min(2, window.devicePixelRatio || 1);     // drawn at the screen's pixel ratio: at 1.5 the lines went soft
  W = stage.clientWidth; H = stage.clientHeight;
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  cv.style.width = W + 'px'; cv.style.height = H + 'px';
  barRect = null; curves = null;
  // set the canvas up now (its first draw allocates it: a 230 ms frame where the streams first launched)
  ctx.fillStyle = 'rgba(0,0,0,0.01)'; ctx.fillRect(0, 0, 2, 2); ctx.clearRect(0, 0, cv.width, cv.height);
});

var shown = false, barRect = null, curves = null, curveKey = '';
// a stream's curve, from the bar's lower edge down to the device: sampled when the devices move
function curve(a, b) {
  var dy = b.y - a.y, pts = [];
  var c1 = { x: a.x, y: a.y + dy * 0.52 }, c2 = { x: b.x, y: b.y - dy * 0.58 };
  for (var i = 0; i <= 96; i++) {
    var t = i / 96, u = 1 - t;
    pts.push({ x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x, y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y });
  }
  pts.a = a; pts.b = b;
  return pts;
}
var streaks = null, packets = null, packetHead = 9, lastNow = 0;
export function updateStreams(p, now, active) {
  var on = active && p > LAUNCH[0][0] - 2;
  if (!on) { if (shown) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); shown = false; bar.classList.remove('beaming'); } return; }
  var dt = lastNow ? Math.min(0.05, (now - lastNow) / 1000) : 1 / 60; lastNow = now;
  // the launch eases in and out of each stream's window, so the head accelerates away and settles onto the device
  var launch = LAUNCH.map(function (r) { var x = clamp((p - r[0]) / (r[1] - r[0])); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; });
  // the devices move (they rise, the camera travels and cranes): the curves follow their attach points, projected
  var cam = document.getElementById('camera').style.transform, wy = gsap.getProperty(devWrap, 'y'), ws = gsap.getProperty(devWrap, 'scale');
  shown = true;
  bar.classList.toggle('beaming', launch[0] > 0.02);
  if (!streaks) {
    var c = streakColours();
    // on the light ground the packets are cyan-to-white glints on the line (cobalt over it read as dark knots)
    var pc = c.light ? Object.assign({}, c, { a: c.b }) : c;
    streaks = ORDER.map(function () { return new Streak(c); });
    packets = ORDER.map(function () { return [new Streak(pc), new Streak(pc)]; });
    packetHead = pc === c ? 9 : 6;
  }

  // the bar never moves, and the curves only change while the devices rise: both are kept between frames
  if (!barRect) barRect = bar.getBoundingClientRect();
  var br = barRect, ck = wy + ',' + ws + ',' + cam;
  if (ck !== curveKey || !curves) {
    curveKey = ck;
    var wx = gsap.getProperty(devWrap, 'x'), wz = gsap.getProperty(devWrap, 'z'), W2 = +devWrap.dataset.w / 2, H2 = +devWrap.dataset.h / 2;
    curves = ORDER.map(function (name, i) {
      var d = devs[name]; if (!d) return null;
      var a = { x: br.left + br.width * [0.5, 0.36, 0.64][i], y: br.bottom - 3 };
      var m = project(wx + (d.attach[0] - W2) * ws, wy + (d.attach[1] - H2) * ws, wz);
      return Streak.prep(curve(a, { x: m.x, y: m.y }));
    });
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  var time = now / 1000;
  curves.forEach(function (pts, i) {
    if (!pts) return;
    var L = launch[i];
    if (L <= 0) return;
    // the stream itself: while it launches, a flaring head that sheds sparks; once connected, the whole line twinkles
    streaks[i].draw(ctx, pts, L, { width: 2, guide: 0.1, tail: 1, base: L < 1 ? 0.3 : 0.6, dust: 26, head: L < 1 ? 18 : 10, shed: L < 1 ? 70 : 4, time: time + i, dt: dt, k: 1 });
    // packets of light running down the connected streams, fading in and out along the way
    if (L >= 1 && !reduced) {
      for (var j = 0; j < 2; j++) {
        var t = ((now / 1800) + j * 0.5 + i * 0.21) % 1, kk = Math.sin(Math.PI * t);
        packets[i][j].draw(ctx, pts, t, { width: 1.8, guide: 0, tail: 0.16, base: 0, dust: 40, head: packetHead, shed: 24 * kk, time: time, dt: dt, k: 0.35 + 0.65 * kk });
      }
    }
  });
}
