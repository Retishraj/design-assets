/* the camera: one continuous move through the world (world.js), keyed to the scroll. At each chapter's rest it looks
   square at that chapter's station from the distance the sets were designed at, so a set is framed exactly as drawn
   and the page elements over it (the keypad, the switcher) sit where they should. It holds still while the zipper is
   in the reader's hands, pulls back and cranes up into the burst, and drifts through each hold. Between stations it
   zooms out and in again: it pulls far back and cranes up until the set it leaves and the next one are both in view,
   orbits round (alternating sides from move to move, with a touch of roll), and dives in to land square on the next
   set. The travel follows the scroll closely (a gentle ease, still only at the rests).
   The pose is a point looked at, a distance, and yaw, pitch and roll; it's written as one matrix3d on #camera.
   project() maps a world point to the stage, for the page elements that follow things through the move. */
import { Z1, T, END } from './scroll.js';
import { STATION, travel } from './world.js';
import { fit } from './layout.js';
import { reduced } from './util.js';

var cam = document.getElementById('camera');
cam.style.transformOrigin = '0 0 0';
// the eye in the scene: the 1100×720 frame seen from 1800 px (styles.css .scene: perspective 1800px, origin 50% 42%)
var EX = 550, EY = 302.4, EZ = 1800, DEG = Math.PI / 180;

// square on chapter i's station, plus offsets
function square(i, o) {
  var s = STATION[i], p = { fx: EX + s[0], fy: EY + s[1], fz: s[2], d: EZ, yaw: 0, pitch: 0, roll: 0 };
  for (var k in o || {}) p[k] += o[k];
  return p;
}
// each hold drifts from one side of the rest to the other (yaw, degrees, and distance), so scroll always moves something
var DRIFT = reduced ? 0 : 1;
function hold(i, side) { return square(i, { yaw: 3 * side * DRIFT, d: 45 * side * DRIFT }); }

/* the move: [from p, to p, pose at the start, pose at the end, how it eases, what it adds on the way: the zoom
   (distance, pitch, focus height) out over the first 45% and in over the last 45%, holding wide between; the orbit
   (yaw, roll, in degrees) swinging out and back, widest midway]. Wide, the focus is raised so the sets, looked down
   on, sit mid-screen (the copy below them is out between rests) */
var K = reduced ? 0 : 1;
var burst = square(0, { d: 600 * K, pitch: 10 * K, yaw: -8 * K, roll: -1 * K, fy: -60 * K });
var SEG = [
  [0, Z1, square(0), square(0), 'sine'],                                             // still: the zipper is in hand
  [Z1, T[0][1], square(0), burst, 'sine'],                                           // the burst: back, up, round
  [T[0][1], 240, burst, hold(1, 1), 'sine'],                                         // settling in front of the bag
  [240, T[1][0], hold(1, 1), hold(1, -1), 'sine'],
  // 2 → 3: follows the files as they fly to the next set: far back and high over the studio, orbiting left
  [T[1][0], T[1][1], hold(1, -1), hold(2, 1), 'travel', { d: 2200, pitch: 20, yaw: -30, roll: -3, fy: -230 }],
  [T[1][1], T[2][0], hold(2, 1), hold(2, -1), 'sine'],
  // 3 → 4: carries the landing page along, orbiting right round it as it pulls away and dives back in
  [T[2][0], T[2][1], hold(2, -1), hold(3, 1), 'travel', { d: 1900, pitch: 14, yaw: 32, roll: 3, fy: -190 }],
  [T[2][1], T[3][0], hold(3, 1), hold(3, -1), 'sine'],
  // 4 → 5: back out and round the other way, rising, into the versions' line-up
  [T[3][0], T[3][1], hold(3, -1), hold(4, 1), 'travel', { d: 2000, pitch: 18, yaw: -28, roll: -2.5, fy: -210 }],
  // chapter 5 holds through the update: in closer while the beam runs, back out after
  [T[3][1], 752, hold(4, 1), square(4, { d: -120 * K, pitch: -1 * K }), 'sine'],
  [752, T[4][0], square(4, { d: -120 * K, pitch: -1 * K }), hold(4, -1), 'sine'],
  // 5 → 6: the biggest: up and far back over the whole studio, orbiting right, then down onto the devices
  [T[4][0], T[4][1], hold(4, -1), hold(5, 1), 'travel', { d: 2400, pitch: 24, yaw: 20, roll: 2.5, fy: -270 }],
  [T[4][1], END, hold(5, 1), hold(5, -1), 'sine']
];
var CH = ['fx', 'fy', 'fz', 'd', 'yaw', 'pitch', 'roll'];

export function poseAt(p) {
  var i = 0; while (i < SEG.length - 1 && p > SEG[i][1]) i++;
  var g = SEG[i], u = Math.min(1, Math.max(0, (p - g[0]) / ((g[1] - g[0]) || 1)));
  var e = g[4] === 'travel' ? travel(u) : 0.5 - 0.5 * Math.cos(Math.PI * u);
  // the extras, 0 and still at both ends: the zoom out over the first 45%, wide, and in over the last 45%; the orbit
  // widest midway
  var zoom = travel(Math.min(u, 1 - u) / 0.45), orbit = Math.sin(Math.PI * u); orbit *= orbit;
  var out = {}, x = g[5] || {};
  CH.forEach(function (k) { out[k] = g[2][k] + (g[3][k] - g[2][k]) * e + (x[k] || 0) * (k === 'yaw' || k === 'roll' ? orbit : zoom) * K; });
  return out;
}

// the matrix: the eye d from the focus, swung round by yaw and up by pitch, looking at it, rolled
function matrix(P) {
  var cy = Math.cos(P.yaw * DEG), sy = Math.sin(P.yaw * DEG), cp = Math.cos(P.pitch * DEG), sp = Math.sin(P.pitch * DEG);
  var ex = P.fx + P.d * sy * cp, ey = P.fy - P.d * sp, ez = P.fz + P.d * cy * cp;
  // the camera's axes in the world: z toward the eye, x to the screen's right (down × z), y to the screen's bottom
  var zx = ex - P.fx, zy = ey - P.fy, zz = ez - P.fz, zl = Math.hypot(zx, zy, zz); zx /= zl; zy /= zl; zz /= zl;
  var xx = zz, xz = -zx, xl = Math.hypot(xx, xz); xx /= xl; xz /= xl;
  var yx = zy * xz, yy = zz * xx - zx * xz, yz = -zy * xx;
  var cr = Math.cos(P.roll * DEG), sr = Math.sin(P.roll * DEG);
  var Xx = xx * cr + yx * sr, Xy = yy * sr, Xz = xz * cr + yz * sr;
  var Yx = yx * cr - xx * sr, Yy = yy * cr, Yz = yz * cr - xz * sr;
  // world → view: the rows are the axes; the eye lands where the scene's perspective puts it
  var tx = EX - (Xx * ex + Xy * ey + Xz * ez), ty = EY - (Yx * ex + Yy * ey + Yz * ez), tz = EZ - (zx * ex + zy * ey + zz * ez);
  return [Xx, Yx, zx, 0, Xy, Yy, zy, 0, Xz, Yz, zz, 0, tx, ty, tz, 1];
}

var M = matrix(square(0)), str = '', lastP = NaN;
export var camState = { version: 0, p: 0 };
export function applyCamera(p) {
  if (p === lastP) return;
  lastP = p; camState.p = p;
  M = matrix(poseAt(p));
  var s = 'matrix3d(' + M.map(function (v, i) { return i === 12 || i === 13 || i === 14 ? v.toFixed(2) : +v.toFixed(7); }).join(',') + ')';
  if (s !== str) { str = s; cam.style.transform = s; camState.version++; }
}

// a world point (frame px) on the stage: x, y in the stage's px, s the scale there (perspective × the frame's fit),
// k the perspective alone
export function project(x, y, z) {
  var vx = M[0] * x + M[4] * y + M[8] * z + M[12], vy = M[1] * x + M[5] * y + M[9] * z + M[13], vz = M[2] * x + M[6] * y + M[10] * z + M[14];
  var k = EZ / Math.max(1, EZ - vz);
  return { x: fit.x + (EX + (vx - EX) * k) * fit.s, y: fit.y + (EY + (vy - EY) * k) * fit.s, s: k * fit.s, k: k };
}
