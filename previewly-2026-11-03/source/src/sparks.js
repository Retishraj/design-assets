/* the light streak, after the reference loader: a faint guide, and over the travelled part a laser that brightens
   toward its head (a soft halo, a glow, a coloured body and a white-hot core, each one continuous stroke whose
   brightness is ramped by a gradient, so there are no joints to bead up), a few fine sparks hugging it near the
   head, a flare at the head with a short hot comet behind it, and sparks shed behind it that drift and fade. One
   renderer for the side timeline and the streams to the devices (the URL bar has a plain progress line). Draws on a
   2D canvas the caller owns (at the device's pixel ratio), along a polyline of points in that canvas's px. */
import { clamp } from './util.js';
import { theme } from './theme.js';

// the streak's colours for the current theme: cobalt to cyan with a white core. On the dark ground the light adds up
// ('lighter'); on the light ground it can't, so the body is a saturated cobalt-to-cyan that the white core reads
// against, the halo is fainter, and the loose sparks are fewer
export function streakColours() {
  return theme() === 'dark'
    ? { a: '#2B6CF6', b: '#2FE4FF', glow: '#2FB8FF', core: '#F2FFFF', mode: 'lighter', light: false }
    : { a: '#2B6CF6', b: '#00A6E6', glow: '#22B5F2', core: '#FFFFFF', mode: 'source-over', light: true };
}

var RGB = {};
function rgba(hex, a) {
  var c = RGB[hex] || (RGB[hex] = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]);
  return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + clamp(a).toFixed(3) + ')';
}
// a small deterministic random, so the sparkle along a streak flickers smoothly instead of reshuffling every frame
function hash(n) { n = (n << 13) ^ n; return 1 - ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824; }

export function Streak(colours) {
  this.c = colours;      // streakColours(), or a variant of it
  this.sparks = [];      // shed sparks: x, y, vx, vy, life, age, size
  this.acc = 0;
}

// the point and direction at fraction t along pts (pts.len: the cumulative lengths, from Streak.prep)
function at(pts, t) {
  var L = pts.total * clamp(t), i = 1;
  while (i < pts.length - 1 && pts.len[i] < L) i++;
  var a = pts[i - 1], b = pts[i], seg = (pts.len[i] - pts.len[i - 1]) || 1, k = (L - pts.len[i - 1]) / seg;
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, dx: (b.x - a.x) / seg, dy: (b.y - a.y) / seg };
}
Streak.prep = function (pts) {
  pts.len = [0]; var s = 0;
  for (var i = 1; i < pts.length; i++) { s += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); pts.len.push(s); }
  pts.total = s || 1;
  return pts;
};
// one continuous path along pts from t0 to t1
function line(ctx, pts, t0, t1) {
  if (t1 - t0 < 1e-4) return false;
  var a = at(pts, t0), b = at(pts, t1), L0 = pts.total * t0, L1 = pts.total * t1;
  ctx.beginPath(); ctx.moveTo(a.x, a.y);
  for (var i = 1; i < pts.length; i++) if (pts.len[i] > L0 && pts.len[i] < L1) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.lineTo(b.x, b.y);
  return true;
}

/* draws the streak on pts up to `t` (0..1). o: { width (body px), guide (alpha of the untravelled guide line, 0 for
   none), tail (fraction of the path the bright part spans behind the head), base (brightness at the tail's start,
   0..1, default 0.25), dust (sparks per 100 px), time (s), dt (s), head (flare radius px), shed (sparks shed per
   second), k (overall strength 0..1) } */
Streak.prototype.draw = function (ctx, pts, t, o) {
  var c = this.c, k = o.k == null ? 1 : o.k, W = o.width || 1.5, base = o.base == null ? 0.25 : o.base;
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // the guide: the whole path, faint
  if (o.guide && line(ctx, pts, 0, 1)) { ctx.strokeStyle = c.a; ctx.globalAlpha = o.guide; ctx.lineWidth = W * 0.7; ctx.stroke(); }
  ctx.globalCompositeOperation = c.mode;
  var h = null;
  if (t > 0) {
    var tail = Math.min(t, o.tail || 1), t0 = t - tail, s = at(pts, t0);
    h = at(pts, t);
    // behind the bright part, a steady dim line
    if (t0 > 0 && line(ctx, pts, 0, t0)) { ctx.strokeStyle = c.a; ctx.globalAlpha = base * 0.8 * k; ctx.lineWidth = W; ctx.stroke(); }
    // the bright part: four layers, each one stroke of the same path, brightening from the tail to the head
    if (line(ctx, pts, t0, t)) {
      var ramp = function (c0, c1, a0, a1) {
        var g = ctx.createLinearGradient(s.x, s.y, h.x, h.y);
        g.addColorStop(0, rgba(c0, a0)); g.addColorStop(1, rgba(c1, a1));
        return g;
      };
      ctx.globalAlpha = k;
      ctx.strokeStyle = ramp(c.glow, c.glow, 0, c.light ? 0.14 : 0.2); ctx.lineWidth = W * 7; ctx.stroke();
      ctx.strokeStyle = ramp(c.glow, c.glow, base * 0.15, c.light ? 0.3 : 0.42); ctx.lineWidth = W * 3; ctx.stroke();
      ctx.strokeStyle = ramp(c.a, c.b, base, 1); ctx.lineWidth = W * 1.3; ctx.stroke();
      ctx.strokeStyle = ramp(c.core, c.core, base * 0.5, c.light ? 0.95 : 1); ctx.lineWidth = W * 0.5; ctx.stroke();
    }
    // the hot comet right behind the head
    var tc = Math.max(t0, t - 26 / pts.total);
    if (line(ctx, pts, tc, t)) {
      var hc = at(pts, tc), g2 = ctx.createLinearGradient(hc.x, hc.y, h.x, h.y);
      g2.addColorStop(0, rgba(c.core, 0)); g2.addColorStop(1, rgba(c.core, 1));
      ctx.globalAlpha = k; ctx.strokeStyle = g2; ctx.lineWidth = W * 1.1; ctx.stroke();
    }
    // a few fine sparks hugging the line, denser and brighter toward the head, twinkling slowly
    var len = pts.total * tail, n = Math.min(90, Math.round(len / 100 * (o.dust || 30) * (c.light ? 0.3 : 0.55))), time = o.time || 0;
    ctx.fillStyle = c.light ? c.b : c.core;
    for (var d = 0; d < n; d++) {
      var r1 = hash(d * 3 + 1), r2 = hash(d * 7 + 5), r3 = (hash(d * 11 + 9) + 1) / 2;
      var f = Math.pow((r1 + 1) / 2, 0.45), p = at(pts, t0 + tail * f), off = r2 * W * (1.2 + 1.4 * (1 - f));
      var tw = 0.5 + 0.5 * Math.sin(time * (1.6 + r3 * 2.4) + d * 1.7);
      ctx.globalAlpha = (0.2 + 0.8 * tw) * f * f * k * (c.light ? 0.7 : 0.9);
      ctx.beginPath(); ctx.arc(p.x - p.dy * off, p.y + p.dx * off, (0.35 + 0.5 * r3) * (0.75 + 0.5 * f), 0, Math.PI * 2); ctx.fill();
    }
    // the head: a small hot core in a soft flare
    var R = (o.head || 10) * k * (c.light ? 0.75 : 1);
    if (R > 0.5) {
      var g = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, R);
      g.addColorStop(0, rgba(c.core, 1)); g.addColorStop(0.18, rgba(c.core, 0.9)); g.addColorStop(0.32, rgba(c.b, c.light ? 0.5 : 0.65));
      g.addColorStop(1, rgba(c.b, 0));
      ctx.globalAlpha = k; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(h.x, h.y, R, 0, Math.PI * 2); ctx.fill();
    }
  }
  // shed sparks: born at the head, thrown back and a little sideways, drifting and fading
  if (h && o.shed && o.dt) {
    this.acc += o.shed * o.dt * (c.light ? 0.4 : 1);
    while (this.acc >= 1 && this.sparks.length < 120) {
      this.acc -= 1;
      var s1 = Math.random(), s2 = Math.random() * 2 - 1;
      this.sparks.push({ x: h.x, y: h.y, vx: -h.dx * (24 + 60 * s1) + h.dy * 22 * s2, vy: -h.dy * (24 + 60 * s1) - h.dx * 22 * s2,
        life: 0.3 + 0.5 * Math.random(), age: 0, size: 0.4 + Math.random() * 0.7 });
    }
  }
  if (o.dt && this.sparks.length) {
    ctx.fillStyle = c.light ? c.b : c.core;
    for (var i = this.sparks.length - 1; i >= 0; i--) {
      var sp = this.sparks[i]; sp.age += o.dt;
      if (sp.age >= sp.life) { this.sparks.splice(i, 1); continue; }
      sp.x += sp.vx * o.dt; sp.y += sp.vy * o.dt; sp.vx *= 0.93; sp.vy *= 0.93;
      var q = 1 - sp.age / sp.life;
      ctx.globalAlpha = q * q * k; ctx.beginPath(); ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();
  return this.sparks.length > 0;
};
Streak.prototype.at = at;
